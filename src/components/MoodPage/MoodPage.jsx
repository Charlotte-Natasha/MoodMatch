import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFavorite, removeFavorite } from '../../services/FavoritesService';

const MoodPage = ({ moodName, bgColorVar, moodImage, loading, error, playlists }) => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState({});

    const moodStyle = { backgroundColor: `var(${bgColorVar})` };

    const handlePlaylistClick = (playlistId) => {
        navigate(`/playlist/${playlistId}`, {
            state: {
                bgColorVar,
                mood: moodName.toLowerCase()
            }
        });
    };

    const handleToggleFavorite = async (playlist, e) => {
        e.stopPropagation();
        try {
            if (favorites[playlist.id]) {
                await removeFavorite(playlist.id);
                setFavorites(prev => ({ ...prev, [playlist.id]: false }));
            } else {
                await addFavorite(playlist);
                setFavorites(prev => ({ ...prev, [playlist.id]: true }));
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
        }
    };

    if (loading || error) {
        return (
            <div style={moodStyle} className="p-8 text-center min-h-screen">
                {loading ? "Loading..." : "Error!"}
            </div>
        );
    }

    const playlistCount = playlists?.length || 0;

    return (
        <div style={moodStyle} className="p-8 min-h-screen">
            <header className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate('/moods-select')}
                    className="flex items-center text-white p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Moods
                </button>
                
                <div className="flex-1 text-center">
                    <h1 className="text-4xl font-bold text-white">{moodName} Vibes</h1>
                    <p className="text-white opacity-80 mt-1">Found {playlistCount} curated playlists for you.</p>
                </div>
                <img src={moodImage} alt={moodName} className="w-20 rounded-full shadow-lg" />
            </header>

            {playlistCount === 0 && (
                <p className="text-white/70 text-center mt-10">No playlists found for this mood.</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {playlists?.map(playlist => (
                    <div 
                        key={playlist.id} 
                        onClick={() => handlePlaylistClick(playlist.id)} 
                        className="bg-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20 transition-colors relative group"
                    >
                        <img src={playlist.imageUrl} alt={playlist.name} className="w-full aspect-square object-cover rounded shadow-md" />
                        
                        <button
                            onClick={(e) => handleToggleFavorite(playlist, e)}
                            className="absolute top-6 right-6 bg-black/60 hover:bg-black/80 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                        >
                            {favorites[playlist.id] ? (
                                <svg className="w-6 h-6 text-red-500 fill-current" viewBox="0 0 20 20">
                                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            )}
                        </button>
                        
                        <h3 className="text-white font-semibold mt-2 truncate">{playlist.name}</h3>
                        <p className="text-sm text-white/70">by {playlist.owner}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoodPage;
