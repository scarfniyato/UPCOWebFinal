import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import WaterQualityTable from "./EnviTables/water_table.jsx";
import WaterQualityChart from "./EnviCharts/water_charts.jsx";
import land_icon from '../../../assets/land_icon.png';
import waterActive_icon from '../../../assets/waterActive_icon.png';
import air_icon from '../../../assets/air_icon.png';
import deleteIcon from '../../../assets/deleteIcon.png';
import updateIcon from '../../../assets/updateIcon.png';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import UPCOLogo from '../../../assets/UPCO_logo1.png';
import './style.css';

const EnviWater = () => {
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

  const handleMonthYearChange2 = (month, year) => {
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
      // 1) Capture the WASTE chart as an image
      const wasteChartElement = document.getElementById('water-quality-chart');
      const wasteChartCanvas = await html2canvas(wasteChartElement, { scale: 2 });
      const wasteChartImgData = wasteChartCanvas.toDataURL('image/png');
  
      // 2) Capture the WATER table as an image
      const waterTableElement = document.getElementById('water-quality-table');
      const waterTableCanvas = await html2canvas(waterTableElement, { scale: 2 });
      const waterTableImgData = waterTableCanvas.toDataURL('image/png');
  
      // 3) Create jsPDF instance
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      // -- Heading / Title / Logo --
      pdf.setFontSize(9);
      pdf.text("Republic of the Philippines", pdfWidth / 2 - 50, 35);
      pdf.setFontSize(14);
      pdf.text("Cavite State University", pdfWidth / 2 - 60, 45);
      pdf.setFontSize(12);
      pdf.text("Pollution Control Office", pdfWidth / 2 - 55, 55);
      pdf.setFontSize(9);
      pdf.text("Indang, Cavite", pdfWidth / 2 - 35, 65);
  
      // We'll use a margin to keep content away from edges
      const margin = 30;
      const contentWidth = pdfWidth - margin * 2;
  
      pdf.setFontSize(12);
      pdf.text('Waste & Water Data Report', pdfWidth / 2 - 60, 90);
  
      // OPTIONAL: Add a logo in the top-right corner
      const logoImage = await loadImage(UPCOLogo);
      pdf.addImage(logoImage, 'PNG', pdfWidth - 70, 15, 40, 40);
  
      // ---------------------------
      //  1) WASTE CHART
      // ---------------------------
      const wasteChartProps = pdf.getImageProperties(wasteChartImgData);
      const wasteChartAspectRatio = wasteChartProps.height / wasteChartProps.width;
      const wasteChartDisplayHeight = contentWidth * wasteChartAspectRatio;
  
      // We'll start placing content around y=120, under the heading
      let currentY = 120;
  
      // Sub-title for waste chart
      pdf.setFontSize(10);
      pdf.text(
        `Waste Chart For ${reportMonth_Chart || 'All Months'} - ${reportYear_Chart || 'All Years'}`,
        margin,
        currentY - 5 // a bit above the chart
      );
  
      // Place the chart
      pdf.addImage(
        wasteChartImgData,
        'PNG',
        margin,
        currentY,
        contentWidth,
        wasteChartDisplayHeight
      );
      currentY += wasteChartDisplayHeight + 20; // gap after chart
  
      // ---------------------------
      //  2) WATER TABLE
      // ---------------------------
      pdf.setFontSize(10);
      pdf.text(
        `Water Table Data For ${reportMonth_Table || 'All Months'} - ${reportYear_Table || 'All Years'}`,
        margin,
        currentY
      );
      const tableStartY = currentY + 10;
  
      // Calculate scaled dimensions for water table
      const waterTableProps = pdf.getImageProperties(waterTableImgData);
      const waterTableAspectRatio = waterTableProps.height / waterTableProps.width;
      const waterTableDisplayHeight = contentWidth * waterTableAspectRatio;
  
      // How much vertical space is left on this page:
      let availableHeight = pdfHeight - tableStartY - margin;
  
      if (waterTableDisplayHeight <= availableHeight) {
        // Fits on the remainder of this page
        pdf.addImage(
          waterTableImgData,
          'PNG',
          margin,
          tableStartY,
          contentWidth,
          waterTableDisplayHeight
        );
      } else {
        // If the table is too big, split it across pages
        const pageCount = Math.ceil(waterTableDisplayHeight / availableHeight);
  
        for (let i = 0; i < pageCount; i++) {
          // For subsequent pages, add a new page
          if (i > 0) {
            pdf.addPage();
          }
          // Negative offset to show the correct "slice"
          const offsetY = -(i * availableHeight);
  
          pdf.addImage(
            waterTableImgData,
            'PNG',
            margin,
            tableStartY + offsetY,
            contentWidth,
            waterTableDisplayHeight
          );
        }
      }
  
      // ---------------------------
      //  3) Footer on the last page
      // ---------------------------
      const finalPage = pdf.getNumberOfPages();
      pdf.setPage(finalPage);
      pdf.setFontSize(10);
      pdf.text('UPCO | Waste & Water Data Report', margin, pdfHeight - margin);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, pdfHeight - margin + 12);
  
      // 4) Save the PDF
      const formattedDate = getCurrentDateFormatted();
      const filename = `${formattedDate}_WasteWaterReport.pdf`;
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
            <Link to="/enviair" className="img_btn">
              <img src={air_icon} alt="Air Pollution" />
            </Link>
            <Link to="/enviwater" className="active_link">
              <img src={waterActive_icon} alt="Water Pollution" />
            </Link>
          </div>
          <div>
            <button className="btn flex-none" onClick={downloadReport}>Download Report</button>
          </div>
        </div>

        <div id="water-quality-chart">
          <div className="dataContainer" style={{ padding: '10px', overflowY: 'auto' }}>
            <div className="bg-white rounded-3xl shadow-lg p-5">
              <WaterQualityChart onMonthYearChange2={handleMonthYearChange2} />
            </div>
          </div>
        </div>

        <div className="addData_btn">
          <Link to="/addwater" className="btn">
            Add New Data
          </Link>
        </div>

        <div id="water-quality-table">
          <div className="dataContainer" style={{ padding: '30px', overflowY: 'auto' }}>
            <div className="" style={{ maxHeight: '570px', overflowY: 'auto', paddingLeft: '30px', paddingRight: '30px' }}>
              <WaterQualityTable onMonthYearChange={handleMonthYearChange} />
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default EnviWater;
