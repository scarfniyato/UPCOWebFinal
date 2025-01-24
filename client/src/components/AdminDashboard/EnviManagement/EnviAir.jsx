import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import AirQualityTable from "./EnviTables/air_table.jsx";
import AirQualityChart from "./EnviCharts/air_charts.jsx";
import land_icon from '../../../assets/land_icon.png';
import water_icon from '../../../assets/water_icon.png';
import airActive_icon from '../../../assets/airActive_icon.png';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import UPCOLogo from '../../../assets/UPCO_logo1.png';
import './style.css';

const EnviAir = () => {
  // Store the selected month/year from <AirTable />
  const [reportMonth_Table, setReportMonth_Table] = useState('');
  const [reportYear_Table, setReportYear_Table] = useState('');
  const [reportMonth_Chart, setReportMonth_Chart] = useState('');
  const [reportYear_Chart, setReportYear_Chart] = useState('');

  // Callback from <AirTable />
  const handleMonthYearChange = (month, year) => {
    setReportMonth_Table(month);
    setReportYear_Table(year);
  };

  const handleMonthYearChange2 = (month,year) => {
    setReportMonth_Chart(month);
    setReportYear_Chart(year);
  };

  // Optional helper to load images as Image objects
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };
  
  const getCurrentDateFormatted = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2); // last two digits
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };
  
  const downloadReport = async () => {
    try {
      // 1) Capture the chart as an image
      const chartElement = document.getElementById('air-quality-chart');
      const chartCanvas = await html2canvas(chartElement, { scale: 2 });
      const chartImgData = chartCanvas.toDataURL('image/png');
  
      // 2) Capture the table as an image
      const tableElement = document.getElementById('air-quality-table');
      const tableCanvas = await html2canvas(tableElement, { scale: 2 });
      const tableImgData = tableCanvas.toDataURL('image/png');
  
      // 3) Create jsPDF instance
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.setFontSize(9);
      pdf.text("Republic of the Philippines", 212, 35);
      pdf.setFontSize(14);
      pdf.text("Cavite State University", 200, 45);
      pdf.setFontSize(12);
      pdf.text("Pollution Control Office", 205, 55);
      pdf.setFontSize(9);
      pdf.text("Indang, Cavite", 220, 65);

      // We'll use margins to keep things neatly inside the page
      const margin = 30;
      const contentWidth = pdfWidth - margin * 2;

      pdf.setFontSize(12);
      pdf.text('Air Data Report', pdfWidth / 2 - 30, 90);
  
      // 3.1) Add your logo (UPCOLogo) if needed
      const logoImage = await loadImage(UPCOLogo);
      pdf.addImage(logoImage, 'PNG', 150, 25, 40, 40);
  
      // -- Chart Title + Chart --
      const chartProps = pdf.getImageProperties(chartImgData);
      const chartAspectRatio = chartProps.height / chartProps.width;
      const chartDisplayHeight = contentWidth * chartAspectRatio;
  
      let currentY = 120; // Starting Y for the chart
      pdf.setFontSize(10);
      pdf.text(
        `Air Chart For ${reportMonth_Chart || 'All Months'} - ${reportYear_Chart || 'All Years'}`,
        margin,
        115
      );
  
      // If the chart is too tall for one page, you can further scale it down,
      // but in many cases letting it spill over is fine or you can handle multi-page logic.
      pdf.addImage(chartImgData, 'PNG', margin, currentY, contentWidth, chartDisplayHeight);
      currentY += chartDisplayHeight + 20; // gap after the chart
  
      // If the chart extends beyond the page, you can add a new page here if needed:
      // e.g. if (currentY + 20 > pdfHeight) { pdf.addPage(); currentY = margin; }
  
      // -- Table Title + Table --
      pdf.setFontSize(10);
      pdf.text(
        `Air Table Data For ${reportMonth_Table || 'All Months'} - ${reportYear_Table || 'All Years'}`,
        margin,
        currentY
      );
      const tableStartY = currentY + 10;
  
      const tableProps = pdf.getImageProperties(tableImgData);
      const tableAspectRatio = tableProps.height / tableProps.width;
      const tableDisplayHeight = contentWidth * tableAspectRatio;
      const availableHeight = pdfHeight - tableStartY - margin;
  
      // Check if table fits on the current page
      if (tableDisplayHeight <= availableHeight) {
        // It fits on one page
        pdf.addImage(tableImgData, 'PNG', margin, tableStartY, contentWidth, tableDisplayHeight);
      } else {
        // Multi-page slicing
        const pageCount = Math.ceil(tableDisplayHeight / availableHeight);
  
        for (let i = 0; i < pageCount; i++) {
          const offsetY = -(i * availableHeight);
          if (i > 0) {
            pdf.addPage();
          }
          pdf.addImage(
            tableImgData,
            'PNG',
            margin,
            tableStartY + offsetY, // negative offset to "slice" the image
            contentWidth,
            tableDisplayHeight
          );
        }
      }
  
      // -- Footer on the last page --
      const finalPage = pdf.getNumberOfPages();
      pdf.setPage(finalPage);
      pdf.setFontSize(10);
      pdf.text('UPCO | Air Data Report', margin, pdfHeight - margin);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, pdfHeight - margin + 12);
  
      // 4) Save the PDF
      const formattedDate = getCurrentDateFormatted();
      const filename = `${formattedDate}_AirReport.pdf`;
      pdf.save(filename);
  
    } catch (error) {
      console.error('Error generating PDF:', error);
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
            <button className="btn flex-none" onClick={downloadReport}>Download Report</button>
          </div>
        </div>

        <div id="air-quality-chart">
          <div className="dataContainer" style={{ padding: '50px', overflowY: 'auto' }}>
            <AirQualityChart onMonthYearChange2={handleMonthYearChange2} />
          </div>
        </div>

        <div className="addData_btn">
          <Link to="/addair" className="btn">
            Add New Data
          </Link>
        </div>

        <div id="air-quality-table">
          <div className="dataContainer" style={{ padding: '30px', overflowY: 'auto' }}>
            <div className="" style={{ maxHeight: '570px', overflowY: 'auto', paddingLeft: '30px', paddingRight: '30px' }}>
              <AirQualityTable onMonthYearChange={handleMonthYearChange}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnviAir;
