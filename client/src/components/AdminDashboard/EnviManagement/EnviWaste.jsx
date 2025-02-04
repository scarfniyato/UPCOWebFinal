import React, { useState } from 'react';
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
import './style.css';

const EnviWaste = () => {
  // Store the selected month/year from <WasteTable />
  const [reportMonth_Table, setReportMonth_Table] = useState('');
  const [reportYear_Table, setReportYear_Table] = useState('');
  const [reportYear_Chart, setReportYear_Chart] = useState('');

  // Callback from <WasteTable />
  const handleMonthYearChange = (month, year) => {
    setReportMonth_Table(month);
    setReportYear_Table(year);
  };

  const handleYearChange = (year) => {
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
    const year = now.getFullYear().toString().slice(2); // Get last two digits of the year
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, add 1 to make it 1-indexed
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const downloadReport = async () => {
    try {
      // 0) Hide last column in the table
      const tableWrapper = document.getElementById('waste-quality-table');
      tableWrapper.classList.add('hide-last-column');

      // 0.1) Remove scroll constraints from table
      const scrollContainer = tableWrapper.querySelector('.scroll-container');
      const originalMaxHeight = scrollContainer.style.maxHeight;
      const originalOverflowY = scrollContainer.style.overflowY;
      scrollContainer.style.maxHeight = 'unset';
      scrollContainer.style.overflowY = 'visible';

      // 2) Capture the chart
      const chartElement = document.getElementById('waste-quality-chart');
      const chartCanvas = await html2canvas(chartElement, { scale: 2 });
      const chartImgData = chartCanvas.toDataURL('image/png');

      // 3) Capture the table
      const tableCanvas = await html2canvas(tableWrapper, { scale: 2 });
      const tableImgData = tableCanvas.toDataURL('image/png');

      // 3.1) Restore the table scroll constraints
      scrollContainer.style.maxHeight = originalMaxHeight;
      scrollContainer.style.overflowY = originalOverflowY;

      // 4) Create the PDF object
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
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

      pdf.setFontSize(12);
      pdf.text("Waste Data Report", 190, 90);
      // 4.3) Add the UPCO logo in top-right corner (40x40)
      const logoImage = await loadImage(UPCOLogo);
      pdf.addImage(
        logoImage,
        'PNG',
        150,
        25,
        40,
        40
      );

      // 5) Add the chart image on this first page
      //    (Below the heading which ends around y=50)

      const chartProps = pdf.getImageProperties(chartImgData);
      const chartHeight = (chartProps.height * pdfWidth) / chartProps.width;

      pdf.setFontSize(10);
      pdf.text(
        `Waste Chart For ${reportYear_Chart || 'All Years'}`,
        20,
        115
      );
      // If the chart is tall, it might spill off the page; for this example, we assume it fits:
      pdf.addImage(chartImgData, 'PNG', 60, 120, pdfWidth, chartHeight);

      // Calculate where the table subheader should start
      const subHeaderY = 105 + chartHeight + 10; // 10 pixels below the chart
      pdf.setFontSize(10);
      pdf.text(`Waste Table Data For ${reportMonth_Table || 'All Months'} - ${reportYear_Table || 'All Years'}`, 20, subHeaderY);

      const tableStartY = 105 + chartHeight + 10; // adding 10 pixels space

      const tableProps = pdf.getImageProperties(tableImgData);
      const tableScaledHeight = (tableProps.height * pdfWidth) / tableProps.width;
      const availableHeight = pdfHeight - tableStartY;
      let yOffset = 0;

      if (tableScaledHeight <= availableHeight) {
        // If the table fits in the remaining page space, add it directly
        pdf.addImage(tableImgData, 'PNG', 0, tableStartY, pdfWidth, tableScaledHeight);
      } else {
        // If the table does not fit, handle it like a multi-page table
        const pageCount = Math.ceil(tableScaledHeight / availableHeight);

        for (let i = 0; i < pageCount; i++) {
          if (i > 0) {
            pdf.addPage();
            yOffset = -(i * availableHeight);
          }
          pdf.addImage(
            tableImgData,
            'PNG',
            0,
            tableStartY + yOffset,
            pdfWidth,
            tableScaledHeight
          );
        }
      }

      const pageCount = Math.ceil(tableScaledHeight / availableHeight);

      pdf.setPage(pageCount + 1); // +1 because the chart also takes up a page
      pdf.setFontSize(10);
      pdf.text("UPCO | Waste Data Report", 20, pdfHeight - 30);
      pdf.setFontSize(10);
      pdf.text("Generated on: " + new Date().toLocaleString(), 20, pdfHeight - 20);

      const formattedDate = getCurrentDateFormatted();
      const filename = `${formattedDate}_WasteReport.pdf`;
      pdf.save(filename);

    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      // Show the last column again
      const tableWrapper = document.getElementById('waste-quality-table');
      tableWrapper.classList.remove('hide-last-column');
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center w-full bg-white p-3 shadow-md rounded-lg">
        <h1 className="text-lg font-semibold text-[#333333]">
          Environmental Data Management
        </h1>
        <Link to="/dashboard/accounts" className="flex items-center space-x-2">
          <MdAccountCircle size={40} className="text-gray-700 hover:text-green-500 transition duration-300" />
        </Link>
      </header>

      <div className="p-2" id="pdf-content">
        <div className="flex gap-x-64 w-full items-center justify-center">
          <div className="img_btn_container flex flex-1 flex-row mb-2 gap-1 w-full ">
            <Link to="/dashboard/waste" className="active_link">
              <img src={landActive_icon} alt="Land Pollution" style={{ width: '80px', height: '80px' }} />
            </Link>
            <Link to="/dashboard/air" className="img_btn">
              <img src={air_icon} alt="Air Pollution" style={{ width: '70px', height: '70px' }} />
            </Link>
            <Link to="/dashboard/water" className="img_btn">
              <img src={water_icon} alt="Water Pollution" style={{ width: '70px', height: '70px' }} />
            </Link>
          </div>

          <div>
            <button className="btn flex-none w-20 h-8 text-xs " onClick={downloadReport}>Download Report</button>
          </div>
        </div>

        <div id="waste-quality-chart">
          <div className="dataContainer" style={{ padding: '50px', overflowY: 'auto' }}>
            <WasteQualityChart onYearChange={handleYearChange} />
          </div>
        </div>

        <div className="addData_btn">
          <Link to="/dashboard/addwaste" className="btn">
            Add New Data
          </Link>
        </div>

        {/* TABLE: pass our callback so we get the selectedMonth/Year */}
        <div id="waste-quality-table">
          <div className="dataContainer" style={{ paddingTop: '50px', paddingBottom: '30px' }}>
            <div
              className="scroll-container"
              style={{
                maxHeight: '570px',
                overflowY: 'auto',
                paddingLeft: '30px',
                paddingRight: '30px'
              }}
            >
              <WasteTable onMonthYearChange={handleMonthYearChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnviWaste;
