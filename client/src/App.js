import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import StudentDashboard from "./pages/StudentDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmployerApplications from "./pages/EmployerApplications";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import JobHistory from "./pages/JobHistory";

import EmployerPostJob from "./pages/EmployerPostJob";
import FindJob from "./pages/FindJob";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import AdminUsers from "./pages/AdminUsers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentProfileView from "./pages/StudentProfileView";
import Chat from "./pages/Chat";
import EmployerHistory from "./pages/EmployerHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/employer" element={<EmployerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/post-job" element={<EmployerPostJob />} />
        <Route path="/employer-applications" element={<EmployerApplications />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/job-history" element={<JobHistory />} />
        <Route path="/find-job" element={<FindJob />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/student-profile/:id" element={<StudentProfileView />}/>
        <Route path="/chat/:otherUserId" element={<Chat />}/>
        <Route path="/employer-history" element={<EmployerHistory />}/>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
    
  );
}

export default App;