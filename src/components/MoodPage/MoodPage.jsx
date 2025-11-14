import React from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";
import { useFetchPlaylists } from "../../hooks/useFetchPlaylists";
import { FaHeart, FaRegHeart } from "react-icons/fa";

// Renaming prop back to bgColorVar for compatibility with CSS variable usage
const MoodPage = ({ moodName, bgColorVar, moodImage }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { playlists, isLoading, error } = useFetchPlaylists(moodName);

  const liked = isFavorite(moodName);

  return (
    <div
      className="min-h-screen flex flex-col p-5 text-white" // FIX: Apply CSS variable correctly using the var() syntax
      style={{ backgroundColor: `var(${bgColorVar})` }}
    >
      {/* -------------------------------- Header -------------------------------- */}
      <header className="flex justify-between items-center py-4">
        {/* Left side: Back button + mood image */}
        <div className="flex items-center space-x-3">
          <button
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
            onClick={() => navigate("/moods-select")}
          >
            ← Back
          </button>
          {moodImage && (
            <img
              src={moodImage}
              alt={moodName}
              className="w-14 h-14 object-cover rounded-full shadow-lg"
            />
          )}
        </div>

        {/* Middle: Mood Title + playlist count */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">{moodName}</h1>
          <p className="opacity-90 text-sm">
            {playlists.length} curated playlists
          </p>
        </div>

        {/* Right: Like button */}
        <button
          className={`text-3xl transition ${
            liked ? "text-red-500" : "text-white/70"
          }`}
          onClick={() => toggleFavorite(moodName)}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
        </button>
      </header>

      {/* -------------------------------- Playlist Section -------------------------------- */}
      <div className="grow overflow-y-auto px-4 mt-6">
        {isLoading ? (
          <p className="text-center mt-10 text-lg">Loading playlists… 🎶</p>
        ) : error ? (
          <p className="text-center mt-10 text-red-300">
            Error loading playlists
          </p>
        ) : playlists.length > 0 ? (
          <div className="space-y-4">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className="bg-white/10 hover:bg-white/20 p-4 rounded-xl backdrop-blur-md cursor-pointer transition shadow-md flex justify-between items-center"
                onClick={() =>
                  navigate(`/player?playlistId=${pl.id}&mood=${moodName}`)
                }
              >
                <div>
                  <p className="font-semibold">{pl.name}</p>
                  <p className="text-sm opacity-70">{pl.artist}</p>
                </div>
                <div className="text-xl">▶️</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-10 text-gray-300">
            No playlists found for {moodName}.
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-sm opacity-70 py-4">
        Enjoy your vibe ✨
      </footer>
    </div>
  );
};

export default MoodPage;
