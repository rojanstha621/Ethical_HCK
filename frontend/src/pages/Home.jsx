import React from "react";
import HeroSection from "../components/home/HeroSection.jsx";
import WhatWeDoSection from "../components/home/WhatWeDoSection.jsx";
import MembersSection from "../components/home/MembersSection.jsx";
import EventsSection from "../components/home/EventsSection.jsx";
import ProjectsSection from "../components/home/ProjectsSection.jsx";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="space-y-20 md:space-y-24">
      <HeroSection />
      <WhatWeDoSection />
      <EventsSection />
      <ProjectsSection />
      <MembersSection onViewAll={() => navigate("/members")} />
    </div>
  );
}

export default Home;
