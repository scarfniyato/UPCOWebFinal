import React from 'react'
import Navbar from '../navbar2'
import WaterChart from '../../AdminDashboard/EnviManagement/EnviCharts/water_charts'
import land_icon from '../../../assets/land_icon.png';
import waterActive_icon from '../../../assets/waterActive_icon.png';
import air_icon from '../../../assets/air_icon.png';
import { Link } from 'react-router-dom';

const WaterPollution = () => {
    return (
        <div>
            <Navbar />
            <section className='flex flex-col w-full'>
            <div className='text-center text-dark fbold border-bottom w-5/6'>
            <h5>Cavite State University - Indang Campus</h5>
            <p1 className='text-4xl mt-5'>State of the Environment</p1>
            <div className='text-left mt-20'>
                State of the Environment / Air Pollution
            </div>
            </div>
            <hr className='border border-dark'/>


            <div className=" ">
                <div className="img_btn_container flex flex-1 flex-row mt-2 gap-1 w-full ">
                <Link to="/landpollution" className="img_btn">
                <img src={land_icon} alt="Land Pollution" />
                </Link>
                <Link to="/airpollution" className="img_btn">
                <img src={air_icon} alt="Air Pollution" />
                </Link>
                <Link to="/waterpollution" className="active_link">
                <img src={waterActive_icon} alt="Water Pollution" />
                </Link>
                </div>
            </div>

            <div className='bg-white p-5 rounded-xl m-5 w-5/6'>
            <WaterChart />
            </div>
            </section>
        </div>
      )
}

export default WaterPollution