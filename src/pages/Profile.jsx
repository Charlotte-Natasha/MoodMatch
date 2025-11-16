import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaMusic,
  FaClock,
  FaChartLine,
  FaSpotify,
} from "react-icons/fa";

import { getCurrentUser, logout } from "../services/SpotifyAuth";

// ---------------- MoodBar Component -----------------
const MoodBar = ({ mood, icon, colorVar, plays, maxPlays }) => {
  const percentage = (plays / maxPlays) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-lg font-semibold flex items-center space-x-2">
          <span className="text-2xl">{icon}</span>
          <span>{mood}</span>
        </span>
        <span className="text-sm opacity-80">{plays} plays</span>
      </div>

      <div className="w-full bg-white/20 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all duration-700"
          style={{
            width: `${percentage}%`,
            backgroundColor: `var(${colorVar})`,
          }}
        ></div>
      </div>
    </div>
  );
};

// ------------------------------------------------------

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // You can keep these mock stats for now or remove them
  const MOCK_STATS = [
    { name: "Songs Played", icon: FaMusic, value: 247 },
    { name: "Hours Streamed", icon: FaClock, value: 58.5 },
  ];

  const MOCK_TOP_MOODS = [
    { mood: "Happy", icon: "😄", plays: 89, colorVar: "--color-mood-happy" },
    { mood: "Chill", icon: "😌", plays: 67, colorVar: "--color-mood-chill" },
    { mood: "Energetic", icon: "⚡", plays: 45, colorVar: "--color-mood-energetic" },
  ];

  // Load Spotify User
  useEffect(() => {
    const loadUser = async () => {
      try {
        const spotifyUser = await getCurrentUser();
        setUser(spotifyUser);
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (
      parts[0][0].toUpperCase() +
      parts[parts.length - 1][0].toUpperCase()
    );
  };

  // LOGOUT BUTTON
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="bg-mood-match min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-mood-match min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl">Failed to load profile</p>
          <button 
            onClick={handleLogout}
            className="mt-4 px-6 py-2 bg-purple-600 rounded-lg"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-mood-match min-h-screen p-5 text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between py-2 mb-8 max-w-7xl mx-auto">
        <button
          className="text-white text-xl p-3 rounded-full bg-black/30 hover:bg-black/50 transition"
          onClick={() => navigate("/moods-select")}
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold mr-auto pl-4">
          Profile Settings
        </h1>
      </header>

      {/* MAIN GRID */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md">
            
            {/* Profile Info */}
            <div className="flex flex-col items-center pb-6 border-b border-white/20">

              <div className="relative mb-4">
                {user.images?.[0]?.url ? (
                  <img
                    src={user.images[0].url}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl mx-auto"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl mx-auto">
                    {getInitials(user.display_name || user.email)}
                  </div>
                )}

                {/* Spotify Badge */}
                {user.product === 'premium' && (
                  <div className="absolute bottom-0 right-0 p-2 bg-green-500 rounded-full text-white shadow-md">
                    <FaSpotify className="w-3 h-3" />
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold">
                {user.display_name || "Spotify User"}
              </h2>

              <p className="text-sm opacity-70 mt-1">
                {user.email}
              </p>

              {/* Premium Badge */}
              {user.product === 'premium' ? (
                <span className="mt-3 px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  ✓ Spotify Premium
                </span>
              ) : (
                <span className="mt-3 px-4 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm font-medium">
                  Free Account
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="pt-6">
              <h3 className="text-lg font-bold mb-3 opacity-90">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                  <span className="flex items-center space-x-2 opacity-80">
                    <FaMusic className="w-4 h-4" />
                    <span>Followers</span>
                  </span>
                  <span className="text-lg font-bold">{user.followers?.total || 0}</span>
                </div>
                
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                  <span className="flex items-center space-x-2 opacity-80">
                    <FaClock className="w-4 h-4" />
                    <span>Country</span>
                  </span>
                  <span className="text-lg font-bold">{user.country || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Spotify Info */}
            <div className="pt-6 border-t border-white/20">
              <h3 className="text-sm font-semibold mb-2 opacity-70">Spotify ID</h3>
              <p className="text-xs font-mono bg-white/5 p-2 rounded break-all">{user.id}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">

          {/* Top Moods (Mock - can be replaced with real data later) */}
          <div className="bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md">
            <h3 className="text-xl font-bold mb-5 flex items-center space-x-2">
              <FaChartLine className="w-5 h-5 text-pink-400" />
              <span>Your Top Moods</span>
            </h3>

            <p className="text-sm opacity-70 mb-4">
              Coming soon! Track your listening habits across different moods.
            </p>

            {MOCK_TOP_MOODS.map((mood) => (
              <MoodBar key={mood.mood} {...mood} maxPlays={100} />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md">
            <h3 className="text-xl font-bold mb-5">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/moods-select')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all text-left flex items-center justify-between"
              >
                <span>Browse Music</span>
                <FaMusic className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate('/history')}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all text-left flex items-center justify-between"
              >
                <span>Listening History</span>
                <FaClock className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md">
            <h3 className="text-xl font-bold mb-5">Account</h3>
            <button
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 px-6 rounded-xl transition-all border border-red-500/30"
              onClick={handleLogout} 
            >
              Logout from Spotify
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;