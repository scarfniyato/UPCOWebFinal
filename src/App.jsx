import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/shared/layout';
import Dashboard from './components/dashboard';
import EnviManagement from './components/AdminDashboard/EnviManagement/envimanagement';
import PublicPageManagement from './components/AdminDashboard/PublicPageManagement/EnviPolicy';
import AccountManagement from './components/AdminDashboard/AccountManagement/accountmanagement';
import UserManagement from './components/AdminDashboard/UserManagement/usermanagement';

function App() {
  const [count, setCount] = useState(0);

  console.log("App component rendered");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="envimanagement" element={<EnviManagement />} />
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
