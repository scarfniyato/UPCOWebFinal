import React from 'react';
import { MdAccountCircle } from "react-icons/md";
import WaterCharts from './AdminDashboard/EnviManagement/EnviCharts/water_charts'
import AirCharts from './AdminDashboard/EnviManagement/EnviCharts/air_charts'

const Dashboardgrids = () => {
  return (
    <div>
      <div className='flex gap-x-64 w-full'>
        <div className='flex-1 flex items-center head'>Welcome to CvSU-Main State of the Environment Dashboard!</div>
        <div className='items-center flex-none'><MdAccountCircle size={50}/></div>
      </div>

      <div className='flex gap-4 mt-4'>
        <div className='flex bg-white flex-auto justify-center items-center shadow-md w-full rounded-md p-5'>
            <div className='flex-col flex text-center'>
                <div className='fbold text-6xl'>98</div>
                <div className='fnormal text-sm'>Public Page Total Visits</div>
            </div>
        </div>

        <div className='flex bg-white flex-auto justify-center items-center shadow-md w-full rounded-md p-5'>
            <div className='flex-col flex text-center'>
                <div className='fbold text-5xl'>1,391.1 kg</div>
                <div className='fnormal text-xs'><br/>Total Solid Waste Generated This Month</div>
            </div>
        </div>

        <div className='flex bg-white flex-auto justify-center items-center shadow-md w-full rounded-md p-5'>
            <div className='flex-col flex text-center'>
                <div className='fbold text-5xl'>Good</div>
                <div className='fnormal text-sm'>Air Quality For The Month</div>
                <p className='text-xs text-fcolor'>(based on AQI of the US Environmental Protection)</p>
            </div>
        </div>  
      </div>

      <div className='flex gap-4 mt-4'>
        <div className='flex bg-white flex-auto justify-center items-center shadow-md w-full rounded-md p-5'>
          <WaterCharts />
        </div>
        <div className='flex bg-white flex-auto justify-center items-center shadow-md w-full rounded-md p-5'>
          <AirCharts />
        </div>
      </div>
    </div>
  );
}

export default Dashboardgrids;