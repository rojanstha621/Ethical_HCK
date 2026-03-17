import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import MatrixRainBackground from "./components/MatrixRainBackground.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Events from "./pages/Events.jsx";
import Projects from "./pages/Projects.jsx";
import AllMembers from "./pages/AllMembers.jsx";

function App() {
  return (
    <div className="relative min-h-screen bg-transparent text-text-primary">
      <MatrixRainBackground />

      {/* global gradient + grid */}
      <div className="pointer-events-none fixed inset-0 z-[1]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,245,160,0.08),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(0,198,255,0.1),_transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.05] bg-hero-grid bg-[length:24px_24px]" />
      </div>

      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/members" element={<AllMembers />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
