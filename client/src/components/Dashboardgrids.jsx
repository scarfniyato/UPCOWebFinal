import React from 'react'; 
import { MdAccountCircle } from "react-icons/md";
import WaterCharts from './AdminDashboard/EnviManagement/EnviCharts/water_charts'
import AirCharts from './AdminDashboard/EnviManagement/EnviCharts/air_charts'
import WasteChart from './AdminDashboard/EnviManagement/EnviCharts/waste_charts'
import AirQualityResult from './AdminDashboard/EnviManagement/ForDashboard/airqualityresult';
import Top10 from "./PublicPage/Map/top10TableList"
import Map from './PublicPage/Map/Map'

const Dashboardgrids = () => {
  return (
    <div>
      <div className='flex gap-x-64 w-full'>
        <div className='flex-1 flex items-center head'>Welcome to CvSU-Main State of the Environment Dashboard!</div>
        <div className='items-center flex-none'><MdAccountCircle size={50}/></div>
      </div>

      <div className='flex gap-4 mt-4'>
        <div className='box'>
            <div className='flex-col flex text-center'>
                <div className='fbold text-6xl'>98</div>
                <div className='fnormal text-sm'>Public Page Total Visits</div>
            </div>
        </div>

        <div className='box'>
            <div className='flex-col flex text-center'>
                <div className='fbold text-5xl'>1,391.1 kg</div>
                <div className='fnormal text-xs'><br/>Total Solid Waste Generated This Month</div>
            </div>
        </div>

        <div className='box'>
            <div className='flex-col flex text-center'>
          <AirQualityResult />
            </div>
        </div>  
      </div>

      <div className='flex gap-4 mt-4'>
        <div className='box'>
          <WaterCharts />
        </div>
        <div className='box'>
          <AirCharts />
        </div>
      </div>

      <div className='flex gap-4 mt-4'>
        <div className='box'>
          <WasteChart />
        </div>
      </div>

      <div className='flex gap-4 mt-4'>
        <div className='box'>
          <Top10 />
        </div>
        <div className='box'>
          <Map />
        </div>
      </div>
    </div>
  );
}

export default Dashboardgrids;