import React from 'react'; 
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

const DashboardCard = ({ children, className = "bg-white rounded items-center" }) => (
  <Card className={`shadow-sm ${className}`}>
    <CardBody>{children}</CardBody>
  </Card>
);

const Dashboardgrids = () => {
  return (
    <div className="p-4">
      
      {/*Header*/}
      <header className="flex justify-between items-center w-full bg-white p-3 shadow-md rounded-lg">
        <h1 className="text-lg font-semibold text-gray-700">
          Welcome to CvSU-Main State of the Environment Dashboard!
        </h1>
        <Link to="/dashboard/accounts" className="flex items-center space-x-2">
          <MdAccountCircle size={40} className="text-gray-700 hover:text-green-500 transition duration-300" />
        </Link>
      </header>

      {/*Stats Section*/}
      <section className="grid grid-cols-3 gap-3 mt-3">
        <DashboardCard>
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800">98</h2>
            <p className="text-xs text-gray-500">Public Page Total Visits</p>
          </div>
        </DashboardCard>

        <DashboardCard>
          <TotalWaste />
        </DashboardCard>

        <DashboardCard>
          <AirQualityResult />
        </DashboardCard>
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

      {/* Waste Chart */}
      <section className="mt-3">
        <DashboardCard>
          <WasteChart />
        </DashboardCard>
      </section>

      {/* Top 10 Table */}
      <section className="mt-3">
        <DashboardCard>
          <Top10 />
        </DashboardCard>
      </section>

      {/* Map Section */}
      <section className="mt-3">
        <DashboardCard>
          <Map />
        </DashboardCard>
      </section>
    </div>
  );
}

export default Dashboardgrids;
