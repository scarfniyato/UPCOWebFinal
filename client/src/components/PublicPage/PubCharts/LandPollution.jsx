import React from 'react';
import WaistChart from '../../AdminDashboard/EnviManagement/EnviCharts/waste_charts';
import landActive_icon from '../../../assets/landActive_icon.png';
import water_icon from '../../../assets/water_icon.png';
import air_icon from '../../../assets/air_icon.png';
import { Link } from 'react-router-dom';

const LandPollution = () => {
    return (
        <div style={{ marginTop: '11%', marginBottom: '12%' }}>
            <Navbar />
            <section className='flex flex-col w-full'>
                {/* Header Section */}
                <div className='text-center text-dark fbold border-bottom w-5/6 mx-auto'>
                    <h5>Cavite State University - Indang Campus</h5>
                    <p1 className='text-4xl mt-5'>State of the Environment</p1>
                    <div className='text-left mt-5'>
                        State of the Environment / Land Pollution
                    </div>
                </div>
                <hr className='border border-dark w-5/6 mx-auto' />

                {/* Icons Section */}
                <div className="flex justify-center items-center gap-5 my-5">
                    <Link to="/landpollution" className="active_link">
                        <img src={landActive_icon} alt="Land Pollution" className="w-12 h-12" />
                    </Link>
                    <Link to="/airpollution" className="img_btn">
                        <img src={air_icon} alt="Air Pollution" className="w-12 h-12" />
                    </Link>
                    <Link to="/waterpollution" className="img_btn">
                        <img src={water_icon} alt="Water Pollution" className="w-12 h-12" />
                    </Link>
                </div>

                {/* Chart Section */}
                <div
                    className='bg-white p-3 rounded-xl m-5 w-5/6 mx-auto'
                    style={{
                        width: '80%', // Explicit width
                        height: '90vh', // Explicit height
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ width: '100%', height: '100%' }}>
                        <WaistChart
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

export default LandPollution;
