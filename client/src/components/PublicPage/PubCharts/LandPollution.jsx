import React from 'react';
import WaistChart from '../../AdminDashboard/EnviManagement/EnviCharts/waste_charts';

const LandPollution = () => {
    return (
        <div>


            {/* Chart Section */}
            <div >
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

        </div>
    );
};

export default LandPollution;
