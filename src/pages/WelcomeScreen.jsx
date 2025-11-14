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
      <header className="text-center pt-8 mb-16">
        <h1 className="header-title text-white text-5xl font-extrabold mb-2 tracking-wide">MOODMATCH</h1>
        <p className="text-white text-lg opacity-90 max-w-xs mx-auto">
          Welcome! Discover music perfectly tailored to your mood.
        </p>
      </header>

      <div className="flex items-center justify-center w-full max-w-sm mb-12 animate-fadeIn">
        <img
          src={MusicArt}
          alt="MoodMatch Music Art"
          className="w-full h-auto max-h-[50vh] rounded-lg shadow-lg"
        />
      </div>

      <div className="w-full max-w-sm text-center mb-10">
        <p className="text-white cta-text mb-10 text-lg font-medium">
          Select your mood and let the music journey begin!
        </p>

        <button
          onClick={handleGetStarted}
          className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-700 text-white text-lg font-semibold transition-shadow shadow-md hover:shadow-lg relative overflow-hidden"
          aria-label="Get started to mood selection"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            🎵 Get Started
          </span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
