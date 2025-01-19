import React from "react"; 
import { Link } from "react-router-dom";
import WasteTable from "./EnviTables/waste_table.jsx";
import WasteQualityChart from "./EnviCharts/waste_charts.jsx";
import landActive_icon from '../../../assets/landActive_icon.png';
import water_icon from '../../../assets/water_icon.png';
import air_icon from '../../../assets/air_icon.png';

// import "../EnviManagement/style.css"

function EnviWaste() {

  return (
    <div className="bg">
      <div className="outerContainer">
        <div className="header">
          <h1>Environmental Data Management</h1>
          <h3>Land Pollution</h3>
        </div>

        <div className="link_btns">
          <div className="img_btn_container">
            <Link to="/enviwaste" className="active_link">
              <img src={landActive_icon} alt="Land Pollution" />
            </Link>
            <Link to="/enviair" className="img_btn">
              <img src={air_icon} alt="Air Pollution" />
            </Link>
            <Link to="/enviwater" className="img_btn">
              <img src={water_icon} alt="Water Pollution" />
            </Link>
          </div>
        </div>

        <div className="dataContainer" style={{ paddingTop: '30px', paddingBottom: '30px' }}>
          <WasteQualityChart />
        </div>
        <div className="addData_btn">
          <Link to="/addwaste" className="btn">
                Add New Data
          </Link>
        </div>
        <div className="dataContainer" style={{ paddingTop: '50px', paddingBottom: '30px' }}>
          <div className="" style={{ maxHeight: '570px', overflowY: 'auto', paddingLeft: '30px', paddingRight: '30px' }}>
            <WasteTable />
          </div>
        </div>
      </div>
    </div>  
  );
}

export default EnviWaste;
