import { Tabs, Tab, Chip } from '@heroui/react';
import React, { useState } from 'react';
import AirPollution from "./PubCharts/AirPollution.jsx";
import WaterPollution from "./PubCharts/WaterPollution.jsx";
import LandPollution from "./PubCharts/LandPollution.jsx";
import land_icon from './../../assets/land_icon.png';
import water_icon from './../../assets/water_icon.png';
import air_icon from './../../assets/air_icon.png';
import airActive_icon from './../../assets/airActive_icon.png';
import waterActive_icon from './../../assets/waterActive_icon.png';
import landActive_icon from './../../assets/landActive_icon.png';

const SOE = () => {
    const [activeTab, setActiveTab] = useState("air");

    return (
        <div className="flex justify-center items-center mt-12">
            <div className="bg-white rounded-lg shadow-lg p-4 w-4/6">
                <Tabs
                    aria-label="Pollution Types"
                    selectedKey={activeTab}
                    onSelectionChange={setActiveTab}
                    classNames={{
                        tabList: 'w-full relative rounded-none',
                        cursor: 'w-full bg-[#22d3ee]',
                        tab: 'max-w-fit my-7 px-1  outline-none', // Removes border on press
                        tabContent: 'group-data-[selected=true]:text-[#06b6d4]'
                    }}
                    color="primary"
                    variant="underlined"
                >
                    <Tab
                        key="air"
                        title={
                            <div className="flex items-center relative group">
                                <img
                                    src={activeTab === "air" ? airActive_icon : air_icon}
                                    alt="Air Pollution Icon"
                                    className="transition-transform duration-300 hover:scale-110 focus:outline-none"
                                />
                                <span className="absolute bottom-[-45px] left-1/2 transform -translate-x-1/2 bg-gray-700 bg-opacity-90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                                    Air Pollution
                                </span>
                            </div>
                        }
                    >
                        <AirPollution />
                    </Tab>
                    <Tab
                        key="land"
                        title={
                            <div className="flex items-center relative group">
                                <img
                                    src={activeTab === "land" ? landActive_icon : land_icon}
                                    alt="Land Pollution Icon"
                                    className="transition-transform duration-300 hover:scale-110 focus:outline-none"
                                />
                                <span className="absolute bottom-[-45px] left-1/2 transform -translate-x-1/2 bg-gray-700 bg-opacity-90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                                    Land Pollution
                                </span>
                            </div>
                        }
                    >
                        <LandPollution />
                    </Tab>
                    <Tab
                        key="water"
                        title={
                            <div className="flex items-center relative group">
                                <img
                                    src={activeTab === "water" ? waterActive_icon : water_icon}
                                    alt="Water Pollution Icon"
                                    className="transition-transform duration-300 hover:scale-110 focus:outline-none"
                                />
                                <span className="absolute bottom-[-45px] left-1/2 transform -translate-x-1/2 bg-gray-700 bg-opacity-90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                                    Water Pollution
                                </span>
                            </div>
                        }
                    >
                        <WaterPollution />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default SOE;