import React from "react";
import { Link } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import AirQualityTable from "./EnviTables/air_table.jsx";
import AirQualityChart from "./EnviCharts/air_charts.jsx";
import land_icon from '../../../assets/land_icon.png';
import water_icon from '../../../assets/water_icon.png';
import airActive_icon from '../../../assets/airActive_icon.png';

function EnviAir() {

  return (
    <div>
      <div className="p-2">
        <div className='flex gap-x-64 w-full'>
          <div className='flex-1 flex items-center head'>Environmental Data Management</div>
          <div className='items-center flex-none'><MdAccountCircle size={50} /></div>
        </div>

        <div className="flex gap-x-64 w-full items-center justify-center">
          <div className="img_btn_container flex flex-1 flex-row mt-2 gap-1 w-full ">
            <Link to="/enviwaste" className="img_btn">
              <img src={land_icon} alt="Land Pollution" />
            </Link>
            <Link to="/enviair" className="active_link">
              <img src={airActive_icon} alt="Air Pollution" />
            </Link>
            <Link to="/enviwater" className="img_btn">
              <img src={water_icon} alt="Water Pollution" />
            </Link>
          </div>
          <div>
            <button className="btn flex-none">Download Report</button>
          </div>
        </div>

        <div className="dataContainer" style={{ padding: '50px', overflowY: 'auto' }}>
          <AirQualityChart />
        </div>
        <div className="addData_btn">
          <Link to="/addair" className="btn">
            Add New Data
          </Link>
        </div>
        <div className="dataContainer" style={{ padding: '30px', overflowY: 'auto' }}>
          <div className="" style={{ maxHeight: '570px', overflowY: 'auto', paddingLeft: '30px', paddingRight: '30px' }}>
            <AirQualityTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnviAir;
