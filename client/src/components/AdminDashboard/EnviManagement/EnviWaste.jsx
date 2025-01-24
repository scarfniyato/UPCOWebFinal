import React from 'react';
import { Link } from 'react-router-dom';
import { MdAccountCircle } from "react-icons/md";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import UPCOLogo from '../../../assets/UPCO_logo1.png';
import WasteTable from "./EnviTables/waste_table.jsx";
import WasteQualityChart from './EnviCharts/waste_charts.jsx';
import landActive_icon from '../../../assets/landActive_icon.png';
import air_icon from '../../../assets/air_icon.png';
import water_icon from '../../../assets/water_icon.png';

const EnviWaste = () => {
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };
  
  const downloadReport = async () => {
    try {
      const chartElement = document.getElementById('waste-quality-chart');
      const tableElement = document.getElementById('waste-quality-table');
  
      const canvas1 = await html2canvas(chartElement, { scale: 2 });
      const canvas2 = await html2canvas(tableElement, { scale: 2 });
  
      const imgData1 = canvas1.toDataURL('image/png');
      const imgData2 = canvas2.toDataURL('image/png');
  
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4"
      });
  
      pdf.setFontSize(16);
      pdf.text("Waste Data Management Report", 20, 20);
      pdf.setFontSize(12);
      pdf.text("Generated on: " + new Date().toLocaleString(), 20, 40);
  
      // Load and add the image from assets folder
      const image = await loadImage(UPCOLogo);
  
      // Assuming image is loaded successfully
      pdf.addImage(image, 'PNG', pdf.internal.pageSize.getWidth() - 60, 10, 40, 40);
  
      const imgProperties1 = pdf.getImageProperties(imgData1);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight1 = (imgProperties1.height * pdfWidth) / imgProperties1.width;
      pdf.addImage(imgData1, 'PNG', 0, 50, pdfWidth, pdfHeight1);
  
      const imgProperties2 = pdf.getImageProperties(imgData2);
      const pdfHeight2 = (imgProperties2.height * pdfWidth) / imgProperties2.width;
      pdf.addImage(imgData2, 'PNG', 0, 50 + pdfHeight1, pdfWidth, pdfHeight2);
  
      pdf.save('WasteQualityReport.pdf');
    } catch (error) {
      console.error("Failed to load or add image to PDF:", error);
    }
  };

    return (
      <div>
        <div className="p-2">
          <div className='flex gap-x-64 w-full'>
            <div className='flex-1 flex items-center head'>Environmental Data Management</div>
            <div className='items-center flex-none'><MdAccountCircle size={50} /></div>
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

          <div id="waste-quality-chart">
            <div className="dataContainer" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
              <WasteQualityChart />
            </div>
          </div>
          <div className="addData_btn">
            <Link to="/addwaste" className="btn">
              Add New Data
            </Link>
          </div>

          <div id="waste-quality-table">
            <div className="dataContainer" style={{ paddingTop: '50px', paddingBottom: '30px' }}>
              <div className="" style={{ maxHeight: '570px', overflowY: 'auto', paddingLeft: '30px', paddingRight: '30px' }}>
                <WasteTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default EnviWaste;