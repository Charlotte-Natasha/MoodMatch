import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaMusic } from 'react-icons/fa';
import { getRecentlyPlayed } from '../services/MusicService';
import { getFirebaseHistory } from '../firebase/firebaseTracking';

function History() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('spotify'); // 'spotify' or 'firebase'
  const [spotifyHistory, setSpotifyHistory] = useState([]);
  const [firebaseHistory, setFirebaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      
      // Load both histories
      const [spotify, firebase] = await Promise.all([
        getRecentlyPlayed(50),
        getFirebaseHistory(50)
      ]);
      
      setSpotifyHistory(spotify);
      setFirebaseHistory(firebase);
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const currentHistory = activeTab === 'spotify' ? spotifyHistory : firebaseHistory;

  return (
    <div className="bg-mood-match min-h-screen p-5 text-white">
      {/* Header */}
      <header className="flex items-center justify-between py-2 mb-8 max-w-7xl mx-auto">
        <button
          className="text-white text-xl p-3 rounded-full bg-black/30 hover:bg-black/50 transition"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-3xl font-semibold mr-auto pl-4">
          Listening History
        </h1>
      </header>

      {/* Tab Switcher */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-4 bg-white/10 p-2 rounded-xl backdrop-blur-md w-fit">
          <button
            onClick={() => setActiveTab('spotify')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'spotify'
                ? 'bg-green-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <FaMusic className="inline mr-2" />
            All Plays ({spotifyHistory.length})
          </button>
          
          <button
            onClick={() => setActiveTab('firebase')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'firebase'
                ? 'bg-purple-600 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <FaClock className="inline mr-2" />
            Mood Plays ({firebaseHistory.length})
          </button>
        </div>

        <p className="text-white/60 text-sm mt-3">
          {activeTab === 'spotify' 
            ? 'All tracks you\'ve played on Spotify' 
            : 'Tracks played through MoodMatch mood pages'}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading history...</p>
        </div>
      )}

      {/* History List */}
      {!loading && (
        <div className="max-w-7xl mx-auto">
          {currentHistory.length === 0 ? (
            <div className="bg-white/10 rounded-xl p-12 text-center backdrop-blur-md">
              <FaMusic className="w-16 h-16 mx-auto mb-4 text-white/40" />
              <h3 className="text-xl font-semibold mb-2">No history yet</h3>
              <p className="text-white/60">
                {activeTab === 'spotify' 
                  ? 'Start playing music on Spotify to see your history' 
                  : 'Play songs from mood pages to track your listening'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentHistory.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/10 rounded-xl p-4 backdrop-blur-md hover:bg-white/20 transition-all flex items-center gap-4"
                >
                  {/* Album Art */}
                  {item.albumImage && (
                    <img
                      src={item.albumImage}
                      alt={item.album}
                      className="w-16 h-16 rounded-lg object-cover shadow-lg"
                    />
                  )}

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate text-lg">
                      {item.trackName}
                    </h3>
                    <p className="text-white/70 truncate">{item.artist}</p>
                    
                    {/* Mood Badge (only for Firebase history) */}
                    {activeTab === 'firebase' && item.mood && (
                      <span 
                        className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: `var(--color-mood-${item.mood})` }}
                      >
                        {item.mood.charAt(0).toUpperCase() + item.mood.slice(1)} Mood
                      </span>
                    )}
                  </div>

                  {/* Time */}
                  <div className="text-right text-white/60 text-sm">
                    <FaClock className="inline mr-1" />
                    {formatDate(activeTab === 'spotify' ? item.playedAt : item.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default History;