import React from "react"; 
import { Link } from "react-router-dom";
import WaterQualityTable from "./EnviTables/water_table.jsx";
import WaterQualityChart from "./EnviCharts/water_charts.jsx";
import land_icon from '../../../assets/land_icon.png';
import waterActive_icon from '../../../assets/waterActive_icon.png';
import air_icon from '../../../assets/air_icon.png';
import deleteIcon from '../../../assets/deleteIcon.png';
import updateIcon from '../../../assets/updateIcon.png';

function EnviWater() {

  return (
    <div className="bg">

      <div className="outerContainer">
        <div className="header">
          <h1>Environmental Data Management</h1>
          <h3>Water Pollution</h3>
        </div>

        <div className="link_btns">
          <div className="img_btn_container">
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

        <div className="dataContainer"  style={{ padding:'50px', overflowY: 'auto'}}>
          <WaterQualityChart />
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
