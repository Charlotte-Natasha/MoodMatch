import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaMusic,
  FaClock,
  FaBell,
  FaCamera,
  FaEdit,
  FaChartLine,
} from "react-icons/fa";

import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


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
  const storage = getStorage();

  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Replace MOCK stats/moods later if needed
  const MOCK_STATS = [
    { name: "Songs Played", icon: FaMusic, value: 247 },
    { name: "Hours Streamed", icon: FaClock, value: 58.5 },
  ];

  const MOCK_TOP_MOODS = [
    { mood: "Happy", icon: "😄", plays: 89, colorVar: "--color-mood-happy" },
    { mood: "Chill", icon: "😌", plays: 67, colorVar: "--color-mood-chill" },
    { mood: "Energetic", icon: "⚡", plays: 45, colorVar: "--color-mood-energetic" },
  ];

  // Listen for logged-in Firebase User
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, []);

    const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (
      parts[0][0].toUpperCase() +
      parts[parts.length - 1][0].toUpperCase()
    );
  };

  // Upload Profile Picture
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      const imgRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(imgRef, file);

      const url = await getDownloadURL(imgRef);
      await updateProfile(user, { photoURL: url });

      setUser({ ...user, photoURL: url });
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setUploading(false);
    }
  };

    // LOGOUT BUTTON
  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="text-white text-center p-10">
        Loading your profile...
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
                {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl mx-auto"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-pink-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl mx-auto">
            {getInitials(user.displayName || user.email)}
          </div>
        )}

                {/* Upload Button */}
                <label className="absolute bottom-0 right-0 p-2 bg-pink-600 rounded-full text-white hover:bg-pink-700 transition cursor-pointer shadow-md">
                  <FaCamera className="w-3 h-3" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {uploading && <p className="text-sm opacity-70">Uploading...</p>}

              <h2 className="text-xl font-bold">
                {user.displayName || "Unnamed User"}
              </h2>

              <p className="text-sm opacity-70 flex items-center space-x-1 mt-1">
                <FaEnvelope className="w-3 h-3" />
                <span>{user.email}</span>
              </p>

              <button className="mt-4 flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition shadow-lg">
                <FaEdit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Stats */}
            <div className="pt-6">
              <h3 className="text-lg font-bold mb-3 opacity-90">Your Stats</h3>
              <div className="space-y-3">
                {MOCK_STATS.map((stat) => (
                  <div
                    key={stat.name}
                    className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
                  >
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

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">

          {/* Top Moods */}
          <div className="bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md">
            <h3 className="text-xl font-bold mb-5 flex items-center space-x-2">
              <FaChartLine className="w-5 h-5 text-pink-400" />
              <span>Your Top Moods</span>
            </h3>

            {MOCK_TOP_MOODS.map((mood) => (
              <MoodBar key={mood.mood} {...mood} maxPlays={100} />
            ))}
          </div>

          {/* Notifications */}
          <div className="bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md">
            <h3 className="text-xl font-bold mb-5 flex items-center space-x-2">
              <FaBell className="w-5 h-5 text-cyan-400" />
              <span>Notifications</span>
            </h3>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-lg">New Playlist Alerts</span>
              <input type="checkbox" defaultChecked className="toggle toggle-primary" />
            </label>

            <p className="text-sm opacity-70 mt-2">
              Get notified when new playlists are curated.
            </p>

            <div className="border-t border-white/20 pt-4 mt-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-lg">Promotional Offers</span>
                <input type="checkbox" className="toggle toggle-primary" />
              </label>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md">
            <h3 className="text-xl font-bold mb-5">Account</h3>
            <button
              className="text-pink-400 hover:text-pink-500 transition font-semibold"
              onClick={handleLogout} 
            >
              Log Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
