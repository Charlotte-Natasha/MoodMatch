import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaMusic, FaClock, FaBell, FaCamera, FaEdit, FaChartLine } from 'react-icons/fa';

// NOTE: We'll use the CSS variables defined in src/App.css for consistency.

// --- Mock Data for the Profile ---
const MOCK_USER_DATA = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  profileImageUrl: "https://placehold.co/150x150/d74c4c/ffffff?text=U", // Placeholder for user image
  stats: [
    { name: "Songs Played", icon: FaMusic, value: 247 },
    { name: "Hours Streamed", icon: FaClock, value: 58.5 },
    // You can add more stats here
  ],
  topMoods: [
    { mood: "Happy", icon: "😄", colorVar: "--color-mood-happy", plays: 89, maxPlays: 100 },
    { mood: "Chill", icon: "😌", colorVar: "--color-mood-chill", plays: 67, maxPlays: 100 },
    { mood: "Energetic", icon: "⚡", colorVar: "--color-mood-energetic", plays: 45, maxPlays: 100 },
  ],
};

// --- Mood Progress Bar Component ---
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
            backgroundColor: `var(${colorVar})`
          }}
          title={`${percentage.toFixed(0)}% of total plays`}
        ></div>
      </div>
    </div>
  );
};


const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-mood-match min-h-screen p-5 text-white">
      
      {/* --- HEADER --- */}
      <header className="flex items-center justify-between py-2 mb-8 max-w-7xl mx-auto">
        <button
          className="text-white text-xl p-3 rounded-full bg-black/30 hover:bg-black/50 transition"
          onClick={() => navigate('/moods-select')} // Navigate back to the main mood selection
          title="Go Back"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold mr-auto pl-4">Profile Settings</h1>
      </header>
      
      {/* --- MAIN CONTENT GRID --- */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

        {/* --- LEFT COLUMN (Profile Info & Stats) --- */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md">
            <div className="flex flex-col items-center pb-6 border-b border-white/20">
              
              {/* Profile Picture */}
              <div className="relative mb-4">
                <img
                  src={MOCK_USER_DATA.profileImageUrl}
                  alt="User Avatar"
                  className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-2xl"
                />
                {/* Camera Icon for changing picture */}
                <button className="absolute bottom-0 right-0 p-2 bg-pink-600 rounded-full text-white hover:bg-pink-700 transition shadow-md">
                  <FaCamera className="w-3 h-3" />
                </button>
              </div>

              <h2 className="text-xl font-bold">{MOCK_USER_DATA.name}</h2>
              <p className="text-sm opacity-70 flex items-center space-x-1 mt-1">
                <FaEnvelope className="w-3 h-3" />
                <span>{MOCK_USER_DATA.email}</span>
              </p>

              <button className="mt-4 flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition shadow-lg">
                <FaEdit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* User Stats */}
            <div className="pt-6">
              <h3 className="text-lg font-bold mb-3 opacity-90">Your Stats</h3>
              <div className="space-y-3">
                {MOCK_USER_DATA.stats.map(stat => (
                  <div key={stat.name} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                    <span className="flex items-center space-x-2 opacity-80">
                      <stat.icon className="w-4 h-4" />
                      <span>{stat.name}</span>
                    </span>
                    <span className="text-lg font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Top Moods & Settings) --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top Moods Card */}
          <div className="bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md">
            <h3 className="text-xl font-bold mb-5 flex items-center space-x-2">
              <FaChartLine className="w-5 h-5 text-pink-400" />
              <span>Your Top Moods</span>
            </h3>
            <div>
              {MOCK_USER_DATA.topMoods.map((moodData) => (
                <MoodBar key={moodData.mood} {...moodData} maxPlays={100} />
              ))}
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md">
            <h3 className="text-xl font-bold mb-5 flex items-center space-x-2">
              <FaBell className="w-5 h-5 text-cyan-400" />
              <span>Notifications</span>
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-lg">New Playlist Alerts</span>
                <input type="checkbox" defaultChecked className="toggle toggle-primary" />
              </label>
              <p className="text-sm opacity-70">Get notified when new playlists are curated for your saved moods.</p>
              
              <div className="border-t border-white/20 pt-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-lg">Promotional Offers</span>
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div>
            </div>
          </div>

          {/* Additional Settings Card (Example) */}
          <div className="bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md">
            <h3 className="text-xl font-bold mb-5">Account</h3>
            <button className="text-red-400 hover:text-red-500 font-semibold transition">
              Log Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;