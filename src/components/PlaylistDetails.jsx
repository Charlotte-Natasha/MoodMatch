import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // ADD useLocation here
import { fetchPlaylistTracks, play } from '../services/MusicService';

function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // ADD this line
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the background color from navigation state
  const bgColorVar = location.state?.bgColorVar || '--color-mood-happy'; // Fallback color

  useEffect(() => {
    loadTracks();
  }, [id]);

  const loadTracks = async () => {
    try {
      const data = await fetchPlaylistTracks(id);
      setTracks(data);
    } catch (err) {
      console.error('Error loading tracks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = async (track) => {
    try {
      await play(track.uri);
    } catch (err) {
      if (err.message.includes('No active device')) {
        alert('Please open Spotify on a device first!');
      } else {
        alert('Error: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 text-white text-center" style={{ backgroundColor: `var(${bgColorVar})` }}>
        Loading tracks...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: `var(${bgColorVar})` }}>
      {/* Rest of your code stays the same */}
      <button
        onClick={() => navigate(-1)}
        className="text-white mb-6 flex items-center gap-2 hover:opacity-80"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

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
            <span className="text-white/60 text-sm">
              {Math.floor(track.duration / 60000)}:{String(Math.floor((track.duration % 60000) / 1000)).padStart(2, '0')}
            </span>
            <button
              onClick={() => handlePlayTrack(track)}
              className="opacity-0 group-hover:opacity-100 transition bg-green-500 hover:bg-green-600 rounded-full p-3"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaylistDetail;