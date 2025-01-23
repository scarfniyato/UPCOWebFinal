import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/shared/layout';
import Dashboard from './components/dashboard';
import PublicPageManagement from './components/AdminDashboard/PublicPageManagement/EnviPolicy';
import AccountManagement from './components/AdminDashboard/AccountManagement/accountmanagement';
import UserManagement from './components/AdminDashboard/UserManagement/usermanagement';
import EnviWater from './components/AdminDashboard/EnviManagement/EnviWater';
import EnviAir from './components/AdminDashboard/EnviManagement/EnviAir';
import EnviWaste from './components/AdminDashboard/EnviManagement/EnviWaste';
import AddWaste from './components/AdminDashboard/EnviManagement/AddEnviData/AddWaste';
import AddAir from './components/AdminDashboard/EnviManagement/AddEnviData/AddAir';
import AddWater from './components/AdminDashboard/EnviManagement/AddEnviData/AddWater';

function App() {
  const [count, setCount] = useState(0);

  console.log("App component rendered");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="EnviWaste" element={<EnviWaste />}/> 
          <Route path="EnviAir" element={<EnviAir />}/>
          <Route path="EnviWater" element={<EnviWater />}/>
          <Route path="AddWaste" element={<AddWaste />}/>
          <Route path="AddAir" element={<AddAir />}/>
          <Route path="AddWater" element={<AddWater />}/>
          <Route path="EnviPolicy" element={<PublicPageManagement />} />
          <Route path="accountmanagement" element={<AccountManagement />} />
          <Route path="userManagement" element={<UserManagement />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
