import React, { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import { Link } from 'react-router-dom';
import WaterCharts from './AdminDashboard/EnviManagement/EnviCharts/water_charts';
import AirCharts from './AdminDashboard/EnviManagement/EnviCharts/air_charts';
import WasteChart from './AdminDashboard/EnviManagement/EnviCharts/waste_charts';
import AirQualityResult from './AdminDashboard/EnviManagement/ForDashboard/airqualityresult';
import TotalWaste from './AdminDashboard/EnviManagement/ForDashboard/totalwaste';
import Top10 from "./PublicPage/Map/top10TableList";
import Map from './PublicPage/Map/Map';
import { Card, CardBody } from "@heroui/react";

/** Reusable Dashboard Card Component (Now Supports Custom Height & Centering) */
const DashboardCard = ({ children, height = "h-full", className = "bg-white rounded-lg items-center " }) => (
  <Card className={`shadow-sm ${height} ${className}`}>
    <CardBody className="h-full flex flex-col items-center justify-center text-center shadow-none">
      {children}
    </CardBody>
  </Card>
);

const Dashboard = () => {

  const [latestMonth, setLatestMonth] = useState('');
  const [latestYear, setLatestYear] = useState('');
  const imageWidth = 1200;
  const imageHeight = 800;

  const bounds = [
    [0, 0],
    [imageHeight, imageWidth],
  ];

  return (
    <div className="p-1">
      {/* Header */}
      <header className="flex justify-between items-center w-full bg-white p-3 shadow-md rounded-lg">
        <h1 className="text-lg font-semibold text-[#333333]">
          Welcome to CvSU-Main State of the Environment Dashboard!
        </h1>
        <Link to="/dashboard/accounts" className="flex items-center space-x-2">
          <MdAccountCircle size={40} className="text-gray-700 hover:text-green-500 transition duration-300" />
        </Link>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-3 gap-3 mt-5 items-stretch h-32">
        <DashboardCard height="h-32">
          <div>
            <h2 className="text-4xl font-bold text-[#333333]">98</h2>
            <span className="fnormal text-xs shadow-[#ffffff]">Public Page Total Visits</span>
          </div>
        </DashboardCard>

        <DashboardCard height="h-32">
          <TotalWaste />
        </DashboardCard>

        <DashboardCard height="h-32">
          <AirQualityResult />
        </DashboardCard>
      </section>

      {/* Waste Chart */}
      <section className="grid grid-cols-2 gap-3 mt-3 mb-[9%] items-stretch h-96">
        <DashboardCard height="min-h-[500px] flex flex-col justify-between text-[#333333]">
          <WasteChart className="w-full h-96" />
        </DashboardCard>

        {/*Top10Table and Map Section*/}
        <section className="grid grid-cols-2 gap-3 m-0 items-stretch h-96">
          <DashboardCard height="h-96">
            <Top10 className="text-xs p-2 h-full" style={{ fontSize: "12px" }} />
          </DashboardCard>

          <DashboardCard className="h-96 w-full p-30px h-auto">
            <h5>CvSU Main Campus - Map</h5>
            <p style={{ marginBottom: '-10px' }}>
              <strong>{latestMonth || 'Loading...'}</strong> <span style={{ margin: '0 1px' }}></span>
              <strong>{latestYear || 'Loading...'} </strong>
            </p>
            <Map />
          </DashboardCard>
        </section>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-2 gap-3 mt-3">
        <DashboardCard>
          <WaterCharts />
        </DashboardCard>

        <DashboardCard>
          <AirCharts />
        </DashboardCard>
      </section>
    </div>
  );
}

export default Dashboard;
