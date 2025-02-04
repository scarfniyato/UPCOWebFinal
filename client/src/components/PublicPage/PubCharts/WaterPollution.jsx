import React from 'react';
import WaterChart from '../../AdminDashboard/EnviManagement/EnviCharts/water_charts';

const WaterPollution = () => {
    return (
        <div >

            {/* Chart Section */}

            <div style={{ width: '100%', height: '100%' }}>
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
    );
};

export default WaterPollution;
