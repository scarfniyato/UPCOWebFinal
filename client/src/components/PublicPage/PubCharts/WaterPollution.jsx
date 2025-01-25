import React from 'react';
import Navbar from '../navbar2';
import WaterChart from '../../AdminDashboard/EnviManagement/EnviCharts/water_charts';
import land_icon from '../../../assets/land_icon.png';
import waterActive_icon from '../../../assets/waterActive_icon.png';
import air_icon from '../../../assets/air_icon.png';
import { Link } from 'react-router-dom';

const WaterPollution = () => {
    return (
        <div style={{ marginTop: '10%', marginBottom: '8%' }}> {/* Removed marginTop */}
            <Navbar />
            <section className='flex flex-col w-full'>
                {/* Header Section */}
                <div
                    className='text-center text-dark fbold border-bottom w-5/6 mx-auto'
                    style={{
                        marginTop: '0px', // Removed additional space above the header
                        paddingTop: '0px', // Adjusted padding for the header
                    }}
                >
                    <h5>Cavite State University - Indang Campus</h5>
                    <p1 className='text-4xl mt-3'>State of the Environment</p1> {/* Adjusted margin */}
                    <div className='text-left mt-3'>
                        State of the Environment / Water Pollution
                    </div>
                </div>
                <hr className='border border-dark w-5/6 mx-auto' />

                {/* Icons Section */}
                <div className="flex justify-center items-center gap-5 my-5">
                    <Link to="/landpollution" className="img_btn">
                        <img src={land_icon} alt="Land Pollution" className="w-12 h-12" />
                    </Link>
                    <Link to="/airpollution" className="img_btn">
                        <img src={air_icon} alt="Air Pollution" className="w-12 h-12" />
                    </Link>
                    <Link to="/waterpollution" className="active_link">
                        <img src={waterActive_icon} alt="Water Pollution" className="w-12 h-12" />
                    </Link>
                </div>

                {/* Chart Section */}
                <div
                    className='bg-white p-4 rounded-lg m-4 w-4/6 mx-auto'
                    style={{
                        width: '80%',
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingBottom: '15%',
                    }}
                >
                    <div style={{ width: '60%', height: '60%' }}>
                        <WaterChart
                            options={{
                                responsive: true, // Ensure the chart is responsive
                                maintainAspectRatio: false, // Disable aspect ratio to fit the container
                                layout: {
                                    padding: 10, // Add some padding to the chart
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            font: {
                                                size: 12, // Adjust font size for labels
                                            },
                                        },
                                    },
                                    y: {
                                        ticks: {
                                            font: {
                                                size: 12, // Adjust font size for labels
                                            },
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WaterPollution;
