import React from "react";
import { useNavigate } from "react-router-dom";
import MusicArt from "../assets/logo2.png";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/mood");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <header className="text-center pt-8 mb-12">
        <h1 className="header-title text-white text-4xl mb-1">MOODMATCH</h1>
        <p className="text-white text-lg opacity-80">Music for every emotion</p>
      </header>

      <div className="flex items-center justify-center w-full max-w-sm my-4">
        <img
          src={MusicArt}
          alt="MoodMatch Music Art"
          className="w-full h-auto max-h-[45vh]"
        />
      </div>

      <div className="w-full max-w-sm text-center mb-10">
        <p className="text-white cta-text mb-8">
          Discover music that matches your emotions
        </p>

        <button
          onClick={handleGetStarted}
          className="w-full h-14 rounded-md text-white text-lg font-semibold relative overflow-hidden"
        >
          <div className="absolute inset-0 z-0 button-gradient-bg"></div>
          <span className="relative z-10">Get Started</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
