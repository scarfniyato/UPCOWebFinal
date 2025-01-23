import React from 'react';
import { Link } from 'react-router-dom';
import Dashboardgrids from './Dashboardgrids';

const Dashboard = () => {
  console.log("Dashboard component rendered");
  return (
    <div className='container mx-auto'>
      <Dashboardgrids />
    </div>
  );
}

export default Dashboard;