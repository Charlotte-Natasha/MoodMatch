import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchPlaylistTracks, play } from "../services/MusicService";
import {
  addFavorite,
  removeFavorite,
  isFavorited,
} from "../services/FavoritesService";

function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const bgColorVar = location.state?.bgColorVar || "--color-mood-happy";
  const _mood = location.state?.mood || "happy"; // 1. Load Tracks (Wrapped in useCallback)

  const loadTracks = useCallback(async () => {
    try {
      const data = await fetchPlaylistTracks(id);
      setTracks(data);
    } catch (err) {
      console.error("Error loading tracks:", err);
    } finally {
      setLoading(false);
    }
  }, [id]); // Dependency: id // 2. Check Favorite Status (Wrapped in useCallback)

  const checkIfFavorited = useCallback(async () => {
    const favorited = await isFavorited(id);
    setIsFavorite(favorited);
  }, [id]); // Dependency: id // 3. useEffect now uses stable functions

  useEffect(() => {
    loadTracks();
    checkIfFavorited();
  }, [loadTracks, checkIfFavorited]); // Dependencies: stable functions

  const handlePlayTrack = async (track) => {
    try {
      await play(track.uri);
    } catch (err) {
      if (err.message.includes("No active device")) {
        alert("Please open Spotify on a device first!");
      } else {
        alert("Error: " + err.message);
      }
    }
  }; // TOGGLE FAVORITE

  const handleToggleFavorite = async () => {
    try {
      // Get playlist info from first track or create minimal playlist object
      const playlistInfo = {
        id: id,
        name: `Playlist ${id}`, // We don't have playlist name, just use ID
        imageUrl: tracks[0]?.albumImage || "", // Use first track's image
        owner: "Spotify",
        uri: `spotify:playlist:${id}`,
      };

      if (isFavorite) {
        await removeFavorite(id);
        setIsFavorite(false);
        alert("Removed from favorites! ❤️");
      } else {
        await addFavorite(playlistInfo);
        setIsFavorite(true);
        alert("Added to favorites! 💚");
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      alert("Error saving favorite");
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen p-8 text-white text-center"
        style={{ backgroundColor: `var(${bgColorVar})` }}
      >
        Loading tracks...{" "}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: `var(${bgColorVar})` }}
    >
      {/* Header with Back Button and Heart */}{" "}
      <div className="flex items-center justify-between mb-6">
        {" "}
        <button
          onClick={() => navigate(-1)}
          className="text-white flex items-center gap-2 hover:opacity-80"
        >
          {" "}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />{" "}
          </svg>
          Back{" "}
        </button>
        {/* HEART BUTTON */}{" "}
        <button
          onClick={handleToggleFavorite}
          className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all backdrop-blur-md"
        >
          {" "}
          {isFavorite ? (
            <svg
              className="w-7 h-7 text-purple-500 fill-current"
              viewBox="0 0 20 20"
            >
              {" "}
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />{" "}
            </svg>
          ) : (
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />{" "}
            </svg>
          )}{" "}
        </button>{" "}
      </div>
      <h1 className="text-white text-4xl font-bold mb-8">Tracks</h1>{" "}
      <div className="space-y-2">
        {" "}
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 hover:bg-white/20 transition-all group flex items-center gap-4"
          >
            {" "}
            <span className="text-white/60 text-sm w-8">{index + 1}</span>{" "}
            <img
              src={track.albumImage}
              alt={track.album}
              className="w-12 h-12 rounded object-cover"
            />{" "}
            <div className="flex-1 min-w-0">
              {" "}
              <h3 className="text-white font-medium truncate">
                {track.title}
              </h3>{" "}
              <p className="text-white/70 text-sm truncate">{track.artist}</p>{" "}
            </div>{" "}
            <span className="text-white/60 text-sm">
              {Math.floor(track.duration / 60000)}:
              {String(Math.floor((track.duration % 60000) / 1000)).padStart(
                2,
                "0"
              )}{" "}
            </span>{" "}
            <button
              onClick={() => handlePlayTrack(track)}
              className="opacity-0 group-hover:opacity-100 transition bg-green-500 hover:bg-green-600 rounded-full p-3"
            >
              {" "}
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                {" "}
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />{" "}
              </svg>{" "}
            </button>{" "}
          </div>
        ))}{" "}
        {tracks.length === 0 && (
          <p className="text-white/70 text-center py-10">
            No tracks found for this playlist.
          </p>
        )}{" "}
      </div>{" "}
    </div>
  );
}

export default PlaylistDetail;
