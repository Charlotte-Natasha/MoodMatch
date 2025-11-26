import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchPlaylistTracks, play } from "../services/MusicService";
import { trackPlay } from "../firebase/firebaseTracking"; 
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
  const mood = location.state?.mood || "happy";

  const loadTracks = useCallback(async () => {
    try {
      const data = await fetchPlaylistTracks(id);
      setTracks(data);
    } catch (err) {
      console.error("Error loading tracks:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkIfFavorited = useCallback(async () => {
    const favorited = await isFavorited(id);
    setIsFavorite(favorited);
  }, [id]);

  useEffect(() => {
    loadTracks();
    checkIfFavorited();
  }, [loadTracks, checkIfFavorited]);

  const handlePlayTrack = async (track) => {
    try {
      
      await trackPlay({
        title: track.title,
        artist: track.artist,
        uri: track.uri,
        albumImage: track.albumImage,
        album: track.album
      }, mood);

      // Play track via Spotify
      await play(track.uri);
    } catch (err) {
      console.error('Error playing track:', err);
      if (err.message.includes("No active device") || err.message.includes("not ready")) {
        alert("Web player not ready yet. Please wait a moment and try again!");
      } else {
        alert("Error: " + err.message);
      }
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const playlistInfo = {
        id: id,
        name: `Playlist ${id}`,
        imageUrl: tracks[0]?.albumImage || "",
        owner: "Spotify",
        uri: `spotify:playlist:${id}`,
      };

      if (isFavorite) {
        await removeFavorite(id);
        setIsFavorite(false);
      } else {
        await addFavorite(playlistInfo);
        setIsFavorite(true);
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
        Loading tracks...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: `var(${bgColorVar})` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-white flex items-center gap-2 hover:opacity-80 bg-black/20 px-4 py-2 rounded-lg"
        >
          ← Back
        </button>
        <button
          onClick={handleToggleFavorite}
          className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all backdrop-blur-md"
        >
          {isFavorite ? "💜" : "🤍"}
        </button>
      </div>

      <h1 className="text-white text-4xl font-bold mb-8">Tracks</h1>
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 hover:bg-white/20 transition-all group flex items-center gap-4"
          >
            <span className="text-white/60 text-sm w-8">{index + 1}</span>
            <img
              src={track.albumImage}
              alt={track.album}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">{track.title}</h3>
              <p className="text-white/70 text-sm truncate">{track.artist}</p>
            </div>
            <button
              onClick={() => handlePlayTrack(track)}
              className="opacity-0 group-hover:opacity-100 transition bg-green-500 hover:bg-green-600 rounded-full p-3"
            >
              ▶
            </button>
          </div>
        ))}
        {tracks.length === 0 && (
          <p className="text-white/70 text-center py-10">
            No tracks found for this playlist.
          </p>
        )}
      </div>
    </div>
  );
}

export default PlaylistDetail;