import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route , Navigate} from 'react-router-dom';
import Layout from './components/shared/layout';
import Dashboard from './components/dashboard';
import PublicPageManagement from './components/AdminDashboard/PublicPageManagement/EnviPolicy';
import AccountManagement from './components/AdminDashboard/AccountManagement/changePassword';
import UserManagement from './components/AdminDashboard/UserManagement/userManagement copy';
import EnviWater from './components/AdminDashboard/EnviManagement/EnviWater';
import EnviAir from './components/AdminDashboard/EnviManagement/EnviAir';
import EnviWaste from './components/AdminDashboard/EnviManagement/EnviWaste';
import AddWaste from './components/AdminDashboard/EnviManagement/AddEnviData/AddWaste';
import AddAir from './components/AdminDashboard/EnviManagement/AddEnviData/AddAir';
import AddWater from './components/AdminDashboard/EnviManagement/AddEnviData/AddWater';
import UpdateWaste from './components/AdminDashboard/EnviManagement/UpdateEnviData/UpdateWaste'
import UpdateWater from './components/AdminDashboard/EnviManagement/UpdateEnviData/UpdateWater'
import UpdateAir from './components/AdminDashboard/EnviManagement/UpdateEnviData/UpdateAir'
import AddAccount from './components/AdminDashboard/UserManagement/index';
import Login from './components/Login/index';
import ForgotPassword from './components/Login/ForgotPassword/index';
import ResetPassword from './components/Login/ResetPassword/index';
import LandingPage from './components/PublicPage/index';
import AirPollution from './components/PublicPage/PubCharts/AirPollution';
import LandPollution from './components/PublicPage/PubCharts/LandPollution';
import WaterPollution from './components/PublicPage/PubCharts/WaterPollution';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth-related Routes */}
        <Route path="login" element={<Login />} />
        <Route path="forgotpass" element={<ForgotPassword />} />
        <Route path="/password-reset/:userId/:token" element={<ResetPassword />} />

        <Route path="/" element={<LandingPage />} />
        <Route path="airpollution" element={<AirPollution />} />
        <Route path="landpollution" element={<LandPollution />} />
        <Route path="waterpollution" element={<WaterPollution />} />

          <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard/waste" element={<EnviWaste />} />
          <Route path="/dashboard/air" element={<EnviAir />} />
          <Route path="/dashboard/water" element={<EnviWater />} />
          <Route path="/dashboard/AddWaste" element={<AddWaste />} />
          <Route path="AddAir" element={<AddAir />} />
          <Route path="AddWater" element={<AddWater />} />
          <Route path="/dashboard/update/solidwaste/:id" element={<UpdateWaste />} />
          <Route path="update/water/:id" element={<UpdateWater />} />
          <Route path="update/air/:id" element={<UpdateAir />} />
          <Route path="/dashboard/policy" element={<PublicPageManagement />} />
          <Route path="/dashboard/accounts" element={<AccountManagement />} />
          <Route path="/dashboard/users" element={<UserManagement />} />
          <Route path="/dashboard/index" element={<AddAccount />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
