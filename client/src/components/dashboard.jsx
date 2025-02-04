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
const DashboardCard = ({ children, height = "h-full", className = "bg-white rounded-lg items-center border-1 border-gray" }) => (
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
    <div >
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
      <section className="grid grid-cols-12 gap-3 mt-3 mb-3 items-stretch h-24 ">
        <DashboardCard className="col-span-3 bg-white rounded-lg items-center border-1 border-gray" height="h-24">
          <div>
            <h2 className="text-4xl font-bold text-[#333333] -mb-3">98</h2>
            <span className="font-normal text-xxs text-[#333333]">Public Page Total Visits</span>
          </div>
        </DashboardCard>

        <DashboardCard className="col-span-4 bg-white rounded-lg items-center border-1 border-gray" height="h-24">
          <TotalWaste />
        </DashboardCard>

        <DashboardCard className="col-span-5 bg-white rounded-lg items-center border-1 border-gray" height="h-24">
          <AirQualityResult />
        </DashboardCard>
      </section>

      {/* Waste Chart */}
      <section className="flex flex-col mt-[12px]  items-stretch h-[400px]">
        <DashboardCard className="min-h-[400px] flex flex-col justify-between text-[#333333] bg-white rounded-lg border-1 border-gray">
          <WasteChart className="w-full h-[300px]" />
        </DashboardCard>
      </section>

      {/*Top10Table Section*/}
      <section className="grid grid-cols-12 gap-3 m-0 items-stretch h-96 w-full">
        <DashboardCard className="col-span-5 h-96 w-full bg-white rounded-lg border-1 border-gray">
          <Top10 className="text-xxs p-2 h-full text-shadow-sm " />
        </DashboardCard>

        {/* Map Section */}
        <DashboardCard className="col-span-7 h-96 w-full p-[30px] bg-white rounded-lg border-1 border-gray">
          <h5>CvSU Main Campus - Map</h5>
          <p style={{ marginBottom: '-10px' }}>
            <strong>{latestMonth || 'Loading...'}</strong> <span style={{ margin: '0 1px' }}></span>
            <strong>{latestYear || 'Loading...'}</strong>
          </p>

          {/* Use Map with dynamic width and height */}
          <Map width="100%" height="500px" latestMonth={latestMonth} latestYear={latestYear} />
        </DashboardCard>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-2 gap-3 mt-2 h-[500px]">
        <DashboardCard>
          <WaterCharts className="w-full h-[300px]" />
        </DashboardCard>

        <DashboardCard>
          <AirCharts className="w-full h-[300px]" />
        </DashboardCard>
      </section>
    </div>
  );
}

export default Dashboard;
