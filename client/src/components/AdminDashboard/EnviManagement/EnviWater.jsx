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
  // Store selected month/year from <WaterQualityChart /> & <WaterQualityTable />
  const [reportMonth_Table, setReportMonth_Table] = useState('');
  const [reportYear_Table, setReportYear_Table] = useState('');
  const [reportMonth_Chart, setReportMonth_Chart] = useState('');
  const [reportYear_Chart, setReportYear_Chart] = useState('');

  // Callbacks
  const handleMonthYearChange = (month, year) => {
    setReportMonth_Table(month);
    setReportYear_Table(year);
  };
  const handleMonthYearChange2 = (month, year) => {
    setReportMonth_Chart(month);
    setReportYear_Chart(year);
  };

  // Helper to load an image
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Optional: format the filename date
  const getCurrentDateFormatted = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2); // last two digits
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const downloadReport = async () => {
    try {
      // 1) Capture the chart as an image (scaled at 2x for clarity)
      const chartElement = document.getElementById('water-quality-chart');
      const chartCanvas = await html2canvas(chartElement, { scale: 2 });
      const chartImgData = chartCanvas.toDataURL('image/png');

      // 2) Capture the table as an image (scaled at 2x for clarity)
      const tableElement = document.getElementById('water-quality-table');
      const tableCanvas = await html2canvas(tableElement, { scale: 2 });
      const tableImgData = tableCanvas.toDataURL('image/png');

      // 3) Create jsPDF instance (A4 portrait in px)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      // Page dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // -- Header / Title --
      pdf.setFontSize(9);
      pdf.text("Republic of the Philippines", pdfWidth / 2 - 50, 35);
      pdf.setFontSize(14);
      pdf.text("Cavite State University", pdfWidth / 2 - 60, 45);
      pdf.setFontSize(12);
      pdf.text("Pollution Control Office", pdfWidth / 2 - 55, 55);
      pdf.setFontSize(9);
      pdf.text("Indang, Cavite", pdfWidth / 2 - 35, 65);

      // We'll use a smaller margin so we can display bigger images
      const margin = 20; 
      let currentY = 90; // start content after heading
      const contentWidth = pdfWidth - margin * 2;

      pdf.setFontSize(12);
      pdf.text('Water Data Report', pdfWidth / 2 - 40, currentY);

      // -- Logo in top-right corner --
      const logoImage = await loadImage(UPCOLogo);
      pdf.addImage(logoImage, 'PNG', pdfWidth - 60, 15, 40, 40);

      // Move down a bit after the heading
      currentY += 30;

      // ---------------------------
      //  1) WATER CHART, scaled up
      // ---------------------------
      const scaleFactorChart = 1.2; // Increase chart size by 20%
      pdf.setFontSize(10);
      pdf.text(
        `Water Chart For ${reportMonth_Chart || 'All Months'} - ${reportYear_Chart || 'All Years'}`,
        margin,
        currentY
      );

      const chartProps = pdf.getImageProperties(chartImgData);
      const chartAspectRatio = chartProps.height / chartProps.width;
      // Potential "larger" width
      let chartDisplayWidth = contentWidth * scaleFactorChart; 
      // If it's too big for the page, revert to contentWidth
      if (chartDisplayWidth > pdfWidth) chartDisplayWidth = contentWidth;
      const chartDisplayHeight = chartDisplayWidth * chartAspectRatio;

      // Center horizontally if chartDisplayWidth < pdfWidth
      let chartX = (pdfWidth - chartDisplayWidth) / 2;
      // Force a minimum margin if you'd like
      if (chartX < margin) chartX = margin;

      currentY += 5; // small gap

      // If the chart is too tall and doesn't fit on the remainder of page, optionally you could add a new page
      // For simplicity, let's just place it (it may spill onto next page)
      pdf.addImage(chartImgData, 'PNG', chartX, currentY, chartDisplayWidth, chartDisplayHeight);
      currentY += chartDisplayHeight + 20;

      // ---------------------------
      //  2) WATER TABLE, scaled up
      // ---------------------------
      pdf.setFontSize(10);
      pdf.text(
        `Water Table Data For ${reportMonth_Table || 'All Months'} - ${reportYear_Table || 'All Years'}`,
        margin,
        currentY
      );
      currentY += 10;

      const scaleFactorTable = 1.2; // Increase table size by 20%
      const tableProps = pdf.getImageProperties(tableImgData);
      const tableAspectRatio = tableProps.height / tableProps.width;
      let tableDisplayWidth = contentWidth * scaleFactorTable + 950;
      if (tableDisplayWidth > pdfWidth) tableDisplayWidth = contentWidth;
      const tableDisplayHeight = tableDisplayWidth * tableAspectRatio + 100;

      // Start of table on this page
      const tableStartY = currentY;

      // Space left on the page
      let availableHeight = pdfHeight - tableStartY - margin;

      // Center horizontally if narrower than the PDF
      let tableX = (pdfWidth - tableDisplayWidth) / 2;
      if (tableX < margin) tableX = margin;

      // If the table is short enough to fit
      if (tableDisplayHeight <= availableHeight) {
        pdf.addImage(
          tableImgData,
          'PNG',
          tableX,
          tableStartY,
          tableDisplayWidth,
          tableDisplayHeight
        );
      } else {
        // Need multiple pages
        const pageCount = Math.ceil(tableDisplayHeight / availableHeight);

        for (let i = 0; i < pageCount; i++) {
          // For subsequent pages, add a new page
          if (i > 0) {
            pdf.addPage();
          }
          const offsetY = -(i * availableHeight);
          pdf.addImage(
            tableImgData,
            'PNG',
            tableX,
            tableStartY + offsetY,
            tableDisplayWidth,
            tableDisplayHeight
          );
        }
      }

      // ---------------------------
      //   3) Footer on Last Page
      // ---------------------------
      const finalPage = pdf.getNumberOfPages();
      pdf.setPage(finalPage);
      pdf.setFontSize(10);
      pdf.text('UPCO | Water Data Report', margin, pdfHeight - margin);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, pdfHeight - margin + 12);

      // 4) Save the PDF
      const formattedDate = getCurrentDateFormatted();
      const filename = `${formattedDate}_WaterReport.pdf`;
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
