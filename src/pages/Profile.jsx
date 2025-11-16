import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaMusic,
  FaClock,
  FaChartLine,
  FaSpotify,
  FaHeart
} from "react-icons/fa";

import { getCurrentUser, logout } from "../services/SpotifyAuth";
import { getMoodStats } from "../firebase/firebaseTracking";

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
  const [moodStats, setMoodStats] = useState([]); // FIX: ADD THIS LINE

  // Mood emoji mapping
  const MOOD_EMOJIS = {
    happy: '😊',
    sad: '😢',
    chill: '😌',
    energetic: '⚡',
    focused: '🎯',
    romantic: '💕',
  };

  const MOOD_COLORS = {
    happy: '--color-mood-happy',
    sad: '--color-mood-sad',
    chill: '--color-mood-chill',
    energetic: '--color-mood-energetic',
    focused: '--color-mood-focused',
    romantic: '--color-mood-romantic',
  };

  // FIX: Only ONE useEffect
  useEffect(() => {
    const loadData = async () => {
      try {
        const spotifyUser = await getCurrentUser();
        setUser(spotifyUser);
        
        // Load mood statistics from Firebase
        const stats = await getMoodStats();
        setMoodStats(stats);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  // FIX: Calculate maxPlays AFTER moodStats is loaded
  const maxPlays = moodStats.length > 0 
    ? Math.max(...moodStats.map(m => m.count)) 
    : 1;

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

        {/* LEFT COLUMN - KEEP AS IS */}
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

            <div className="pt-6 border-t border-white/20">
              <h3 className="text-sm font-semibold mb-2 opacity-70">Spotify ID</h3>
              <p className="text-xs font-mono bg-white/5 p-2 rounded break-all">{user.id}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">

          {/* Top Moods */}
          <div className="bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md">
            <h3 className="text-xl font-bold mb-5 flex items-center space-x-2">
              <FaChartLine className="w-5 h-5 text-pink-400" />
              <span>Your Top Moods</span>
            </h3>

            {moodStats.length === 0 ? (
              <p className="text-sm opacity-70 mb-4">
                Start listening to music to see your mood statistics!
              </p>
            ) : (
              <>
                <p className="text-sm opacity-70 mb-4">
                  Based on {moodStats.reduce((sum, m) => sum + m.count, 0)} plays
                </p>

                {moodStats.slice(0, 5).map((stat) => (
                  <MoodBar 
                    key={stat.mood}
                    mood={stat.mood.charAt(0).toUpperCase() + stat.mood.slice(1)}
                    icon={MOOD_EMOJIS[stat.mood] || '🎵'}
                    colorVar={MOOD_COLORS[stat.mood] || '--color-mood-happy'}
                    plays={stat.count}
                    maxPlays={maxPlays}
                  />
                ))}
              </>
            )}
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

              <button
    onClick={() => navigate('/favorites')}
    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all text-left flex items-center justify-between"
>
    <span>My Favorites</span>
    <FaHeart className="w-5 h-5" />
</button>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md">
            <h3 className="text-xl font-bold mb-5">Account</h3>
            <button
              className="w-full bg-purple-500/20 hover:purple-red-500/30 text-white-400 font-semibold py-3 px-6 rounded-xl transition-all border border-purple-500/30"
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