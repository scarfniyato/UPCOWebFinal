import React from 'react'
import Navbar from '../navbar2'
import WaterChart from '../../AdminDashboard/EnviManagement/EnviCharts/water_charts'

const WaterPollution = () => {
    return (
        <div>
            <Navbar />
            <section className='flex flex-col w-full'>
            <div className='text-center text-dark fbold border-bottom w-5/6'>
            <h5>Cavite State University - Indang Campus</h5>
            <p1 className='text-4xl mt-5'>State of the Environment</p1>
            <div className='text-left mt-20'>
                State of the Enironment/Air Pollution
            </div>
            </div>
            <hr className='border border-dark'/>
            <div className='bg-white p-5 rounded-xl m-5 w-5/6'>
            <WaterChart />
            </div>
            </section>
        </div>
      )
}

export default WaterPollution