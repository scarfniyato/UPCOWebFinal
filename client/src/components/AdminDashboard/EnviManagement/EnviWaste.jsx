import React from 'react';
import { Link } from 'react-router-dom';
import { MdAccountCircle } from "react-icons/md";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import WasteTable from "./EnviTables/waste_table.jsx";
import WasteQualityChart from './EnviCharts/waste_charts.jsx';
import landActive_icon from '../../../assets/landActive_icon.png';
import air_icon from '../../../assets/air_icon.png';
import water_icon from '../../../assets/water_icon.png';

const EnviWaste = () => {
  const downloadReport = async () => {
    const input = document.getElementById('waste-quality-chart');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save('WasteQualityChart.pdf');
  };

  return (
    <div>
      <div className="p-2">
        <div className='flex gap-x-64 w-full'>
          <div className='flex-1 flex items-center head'>Environmental Data Management</div>
          <div className='items-center flex-none'><MdAccountCircle size={50}/></div>
        </div>

        <div className="flex gap-x-64 w-full items-center justify-center">
          <div className="img_btn_container flex flex-1 flex-row mt-2 gap-1 w-full ">
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

          <div>
            <button className="btn flex-none" onClick={downloadReport}>Download Report</button>
          </div>
        </div>

        <div className="dataContainer" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
          <div id="waste-quality-chart">
            <WasteQualityChart />
          </div>
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
};

export default EnviWaste;