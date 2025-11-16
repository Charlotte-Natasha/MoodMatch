import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart } from 'react-icons/fa';
import { getFavorites, removeFavorite } from '../services/FavoritesService';

function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favs = await getFavorites();
      setFavorites(favs);
    } catch (err) {
      console.error('Error loading favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (playlistId, e) => {
    e.stopPropagation();
    
    try {
      await removeFavorite(playlistId);
      setFavorites(prev => prev.filter(fav => fav.playlistId !== playlistId));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  if (loading) {
    return (
      <div className="bg-mood-match min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading favorites...</p>
        </div>
      </div>
    );
  }

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
          Favorite Playlists
        </h1>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {favorites.length === 0 ? (
          <div className="bg-white/10 rounded-xl p-12 text-center backdrop-blur-md">
            <FaHeart className="w-16 h-16 mx-auto mb-4 text-white/40" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-white/60 mb-6">
              Start hearting playlists to save them here!
            </p>
            <button
              onClick={() => navigate('/moods-select')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
            >
              Browse Music
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favorites.map((fav) => (
              <div
                key={fav.playlistId}
                onClick={() => handlePlaylistClick(fav.playlistId)}
                className="bg-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20 transition-colors relative group"
              >
                <img
                  src={fav.imageUrl}
                  alt={fav.name}
                  className="w-full aspect-square object-cover rounded shadow-md"
                />

                {/* Remove Heart Button */}
                <button
                  onClick={(e) => handleRemoveFavorite(fav.playlistId, e)}
                  className="absolute top-6 right-6 bg-black/60 hover:bg-black/80 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-6 h-6 text-purple-500 fill-current" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                  </svg>
                </button>

                <h3 className="text-white font-semibold mt-2 truncate">{fav.name}</h3>
                <p className="text-sm text-white/70">by {fav.owner}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;