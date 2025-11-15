import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

import happyImage from "../assets/Happy.png";
import sadImage from "../assets/Sad.png";
import chillImage from "../assets/Chill.png";
import energeticImage from "../assets/Energetic.png";
import romanticImage from "../assets/Romance.png";
import focusedImage from "../assets/Focused.png";

const ProfileIcon = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  };

  return (
    <div
      className="cursor-pointer"
      onClick={() => navigate("/profile")}
      title="Go to Profile"
    >
      {currentUser ? (
        currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="Profile"
            className="w-15 h-15 rounded-full object-cover"
          />
        ) : (
          <div className="w-15 h-15 rounded-full bg-pink-600 flex items-center justify-center text-white text-sm font-bold">
            {getInitials(currentUser.displayName || currentUser.email)}
          </div>
        )
      ) : (
        <div className="text-2xl opacity-80">👤</div>
      )}
    </div>
  );
};

const MoodButton = ({ mood, imageSrc, colorVar, onClick }) => (
  <div
    onClick={onClick}
    className="aspect-square p-5 rounded-2xl flex flex-col justify-between items-center cursor-pointer transition-transform duration-200 shadow-xl hover:-translate-y-1 hover:shadow-2xl"
    style={{ backgroundColor: `var(${colorVar})` }}
  >
    <img
      src={imageSrc}
      alt={`${mood} mood icon`}
      className="w-3/5 h-auto max-h-4/5 object-contain mb-2"
    />
    <div className="text-lg font-semibold text-white tracking-wide drop-shadow-md">
      {mood}
    </div>
  </div>
);

const Moods = () => {
  const navigate = useNavigate();

  const moods = [
    { mood: "Happy", imageSrc: happyImage, colorVar: "--color-mood-happy", path: "/mood/happy" },
    { mood: "Sad", imageSrc: sadImage, colorVar: "--color-mood-sad", path: "/mood/sad" },
    { mood: "Chill", imageSrc: chillImage, colorVar: "--color-mood-chill", path: "/mood/chill" },
    { mood: "Energetic", imageSrc: energeticImage, colorVar: "--color-mood-energetic", path: "/mood/energetic" },
    { mood: "Romantic", imageSrc: romanticImage, colorVar: "--color-mood-romantic", path: "/mood/romantic" },
    { mood: "Focused", imageSrc: focusedImage, colorVar: "--color-mood-focused", path: "/mood/focused" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center p-5 text-white bg-linear-to-b from-[#2F0222] via-[#4B0B3E] to-[#1A1A1A]">
      <header className="w-full max-w-7xl flex justify-between items-center py-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl p-2 rounded-lg">🎵</span>
          <div>
            <h1 className="text-xl font-semibold">MoodMatch</h1>
            <p className="text-xs opacity-80">Music for every emotion</p>
          </div>
        </div>
        <ProfileIcon />
      </header>
      <main className="grow flex flex-col items-center justify-center text-center w-full max-w-4xl py-10">
        <div className="mb-12">
          <h2 className="text-3xl font-light mb-1">How are you feeling today?</h2>
          <p className="text-lg opacity-80 max-w-lg mx-auto">
            Select your current mood and discover playlists perfectly curated to match your emotions
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 w-full max-w-5xl">
          {moods.map((m) => (
            <MoodButton
              key={m.mood}
              mood={m.mood}
              imageSrc={m.imageSrc}
              colorVar={m.colorVar}
              onClick={() => navigate(m.path)}
            />
          ))}
        </div>
      </main>
      <footer className="w-full max-w-7xl text-center text-xs md:text-sm opacity-70 py-5">
        Click on any mood to explore curated playlists
      </footer>
    </div>
  );
};

export default Moods;
