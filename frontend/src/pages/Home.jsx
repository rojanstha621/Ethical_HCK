import React, { useState } from "react";
import HeroSection from "../components/home/HeroSection.jsx";
import WhatWeDoSection from "../components/home/WhatWeDoSection.jsx";
import MembersSection from "../components/home/MembersSection.jsx";
import WelcomePopup from "../components/home/WelcomePopup.jsx";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  return (
    <>
      <WelcomePopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      <div className="space-y-20 md:space-y-24">
        <HeroSection />
        <WhatWeDoSection />
        <MembersSection onViewAll={() => navigate("/members")} />
      </div>
    </>
  );
}

export default Home;
