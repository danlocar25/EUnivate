import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 

/* Client Pages */
import LandingPage from './view/pages/Client/MainPage';
import About from './view/pages/Client/About';
import Advantage from './view/pages/Client/Advantage';
import Contact from './view/pages/Client/Contact';
import OurTeam from './view/pages/Client/OurTeam';
import EuStore from './view/pages/Client/EuStore';
import Mission from './view/pages/Client/Mission';
import Events from './view/pages/Client/Events';
import Quotation from './view/pages/Client/Quotation';
import Showcases from './view/pages/Client/Showcases';
import Challenges from './view/pages/Client/Challenges';
import ProjectManagement from './view/pages/Client/ProjectManagement';
import Webinars from './view/pages/Client/Webinars';
import Login from './view/pages/Client/Login.jsx';
import Signup from './view/pages/Client/Signup.jsx';
import Forgotpassword from './view/pages/Client/Forgotpassword.jsx';
import ResetPassword from './view/pages/Client/Resetpassword.jsx';
import CTA from "./view/components/Client/LastSection/CTA.jsx";
import MainPage from './view/pages/Client/MainPage.jsx';

// Hooks (for authentication and role-based routing)
import Auth from './view/hooks/Auth.jsx';
import SuperAdminRoute from './view/hooks/SuperadminAuth.jsx';
import ProjectmanagementAuth from './view/hooks/AuthProjectmanagement.jsx';
import Verify2FAPending from './view/hooks/Verify2faPending.jsx';



// Admins
import AdminLayout from './view/components/SuperAdmin/AdminLayout';
import Dashboard from './view/pages/SuperAdmin/Dashboard';
import Project from './view/pages/SuperAdmin/Project';
import Task from './view/pages/SuperAdmin/Task';
import People from './view/pages/SuperAdmin/People';
import Messages from './view/pages/SuperAdmin/Messages';
import Activity from './view/pages/SuperAdmin/Activity';
import Settings from './view/pages/SuperAdmin/Settings';

/* Global CSS */
import './index.css';
import './admin.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cta" element={<CTA />} />
        <Route path="/about" element={<About />} />
        <Route path="/advantage" element={<Advantage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/eu-store" element={<EuStore />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/events" element={<Events />} />
        <Route path="/quotation" element={<Auth><Quotation /></Auth>}/>
        <Route path="/showcases" element={<Showcases />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/project" element={<ProjectmanagementAuth><ProjectManagement /></ProjectmanagementAuth>} />
        <Route path="/webinar" element={<Webinars />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forgotpassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/verify-2fa-pending" element={<Verify2FAPending />} />
        {/* <Route path="/verify-2fa-pending" element={<PrivateOTP><Verify2FAPending /></PrivateOTP>} /> */}

        {/* Admin Routes */}
        <Route
          path="/superadmin/*"
          element={
            <SuperAdminRoute>
              <AdminLayout />
            </SuperAdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="project" element={<Project />} />
          <Route path="task" element={<Task />} />
          <Route path="people" element={<People />} />
          <Route path="messages" element={<Messages />} />
          <Route path="activity" element={<Activity />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
