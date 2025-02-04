import React from 'react';
import AirChart from '../../AdminDashboard/EnviManagement/EnviCharts/air_charts';
import land_icon from '../../../assets/land_icon.png';
import water_icon from '../../../assets/water_icon.png';
import airActive_icon from '../../../assets/airActive_icon.png';
import { Link } from 'react-router-dom';

const AirPollution = () => {
  return (
    <div style={{ marginTop: '6%' }}> {/* Adjusted marginTop */}
      <Navbar />
      <section className='flex flex-col w-full'>
        {/* Header Section */}
        <div className='text-center text-dark fbold border-bottom w-5/6 mx-auto'>
          <h5>Cavite State University - Indang Campus</h5>
          <p1 className='text-4xl mt-5'>State of the Environment</p1>
          <div className='text-left mt-5'>
            State of the Environment / Air Pollution
          </div>
        </div>
        <hr className='border border-dark w-5/6 mx-auto' />

        {/* Icons Section */}
        <div className="flex justify-center items-center gap-5 my-5">
          <Link to="/landpollution" className="img_btn">
            <img src={land_icon} alt="Land Pollution" className="w-12 h-12" />
          </Link>
          <Link to="/airpollution" className="active_link">
            <img src={airActive_icon} alt="Air Pollution" className="w-12 h-12" />
          </Link>
          <Link to="/waterpollution" className="img_btn">
            <img src={water_icon} alt="Water Pollution" className="w-12 h-12" />
          </Link>
        </div>

        {/* Chart Section */}
        <div className='bg-white p-3 rounded-xl m-5 w-5/6 mx-auto'
          style={{
            width: '80%', // Explicit width
            height: '90vh', // Explicit height
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5%',
          }}
        >
          <div style={{ width: '100%', height: '100%' }}>
            <AirChart
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

export default AirPollution;
