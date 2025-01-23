import React from "react"; 
import { Link } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import WaterQualityTable from "./EnviTables/water_table.jsx";
import WaterQualityChart from "./EnviCharts/water_charts.jsx";
import land_icon from '../../../assets/land_icon.png';
import waterActive_icon from '../../../assets/waterActive_icon.png';
import air_icon from '../../../assets/air_icon.png';
import deleteIcon from '../../../assets/deleteIcon.png';
import updateIcon from '../../../assets/updateIcon.png';

function EnviWater() {

  return (
    <div>
          <div className="p-2">
            <div className='flex gap-x-64 w-full'>
              <div className='flex-1 flex items-center head'>Environmental Data Management</div>
              <div className='items-center flex-none'><MdAccountCircle size={50}/></div>
            </div>
    
            <div className="flex gap-x-64 w-full items-center justify-center">
              <div className="img_btn_container flex flex-1 flex-row mt-2 gap-1 w-full ">
            <Link to="/enviwaste" className="img_btn">
              <img src={land_icon} alt="Land Pollution" />
            </Link>
            <Link to="/enviair" className="img_btn">
              <img src={air_icon} alt="Air Pollution" />
            </Link>
            <Link to="/enviwater" className="active_link">
              <img src={waterActive_icon} alt="Water Pollution" />
            </Link>
          </div>
        </div>

        <div className="dataContainer"  style={{ padding:'10px', overflowY: 'auto'}}>
          <div className="bg-white rounded-3xl shadow-lg p-5">
          <WaterQualityChart />
          </div>
        </div>
        <div className="addData_btn">
          <Link to="/addwater" className="btn">
                Add New Data
          </Link>
        </div>        
        <div className="dataContainer" style={{padding:'30px' , overflowY: 'auto'}}>
          <div className="" style={{ maxHeight: '570px', overflowY: 'auto', paddingLeft: '30px', paddingRight: '30px' }}>
            <WaterQualityTable />
          </div>
        </div>

        

      </div>
    </div>  
  );
}

export default EnviWater;
