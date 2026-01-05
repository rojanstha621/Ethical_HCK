import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Events from "./pages/Events.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import AllMembers from "./pages/AllMembers.jsx";
import Admin from "./pages/Admin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";

function App() {
  return (
    <div className="relative min-h-screen bg-background text-text-primary">
      {/* Clean minimal background - matching inredlabs style */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black" />
      </div>

      <Routes>
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/members" element={<AllMembers />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
