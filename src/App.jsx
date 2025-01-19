import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/shared/layout"
import Dashboard from './components/AdminDashboard/Dashboard/dashboard'
import EnviManagement from './components/AdminDashboard/EnviManagement/envimanagement'
import PublicPageManagement from './components/AdminDashboard/PubicPageManagement/EnviPolicy'
import AccountManagement from './components/AdminDashboard/AccountManagement/accountmanagement'
import UserManagement from './components/AdminDashboard/UserManagement/usermanagement'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="envimanagement" element={<EnviManagement />} />
          <Route path="EnviPolicy" element={<PublicPageManagement />} />
          <Route path="accountmanagement" element={<AccountManagement />} />
          <Route path="usermanagement" element={<UserManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
