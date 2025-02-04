import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import CustomButton from "../CustomButton.jsx";
import {Button} from "@heroui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';


const PublicEnviPolicies = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('/api/files'); // Fetch files from backend
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching files:', error.message);
            }
        };
        fetchFiles();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto relative">
            <style>
                {`
                /* Darker Blue for Pagination Dots */
                .custom-pagination .swiper-pagination-bullet {
                    background-color: #4E7C96 !important; /* Darker Blue for inactive dots */
                    opacity: 0.7;
                    transition: opacity 0.3s ease-in-out;
                }
                .custom-pagination .swiper-pagination-bullet-active {
                    background-color: #3E6A84 !important; /* Even darker blue for active dots */
                    opacity: 1;
                }
                `}
            </style>

            {files.length > 0 ? (
                <>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={40}
                        slidesPerView={3}
                        navigation={{
                            prevEl: ".custom-prev",
                            nextEl: ".custom-next",
                        }}
                        pagination={{ clickable: true, el: ".custom-pagination" }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="py-6"
                    >
                        {files.map((file) => {
                            const embedLink = file.link.replace('/view', '/preview');
                            return (
                                <SwiperSlide key={file._id}>
                                    <div className="bg-white my-5 rounded-lg shadow-md p-5 flex flex-col items-center text-center transition-transform transform hover:scale-105 w-64 h-80">
                                        <iframe
                                            src={embedLink}
                                            className="w-full h-48 mb-4 rounded-lg"
                                            title={file.title}
                                        ></iframe>
                                        <h3 className="text-gray-700 text-sm font-semibold mb-2 truncate w-full">
                                            {file.title}
                                        </h3>
                                        <CustomButton
                                            className="my-2"
                                            onPress={() => window.open(file.link, "_blank")}
                                        >
                                            Read more
                                        </CustomButton>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* ✅ Navigation Buttons with Darker Blue and Shadows */}
                    <Button className="custom-prev absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-[#4E7C96] text-white border border-[#3E6A84] rounded-full shadow-lg transition-all hover:bg-[#3E6A84] z-10">
                        <ChevronLeftIcon className="w-6 h-6 stroke-2" />
                    </Button>
                    <Button className="custom-next absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-[#4E7C96] text-white border border-[#3E6A84] rounded-full shadow-lg transition-all hover:bg-[#3E6A84] z-10">
                        <ChevronRightIcon className="w-6 h-6 stroke-2" />
                    </Button>

                    {/* ✅ Custom Pagination with Darker Blue */}
                    <div className="flex justify-center mt-4">
                        <div className="custom-pagination"></div>
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-600">No policies available at the moment.</p>
            )}
        </div>
    );
};

export default PublicEnviPolicies;
