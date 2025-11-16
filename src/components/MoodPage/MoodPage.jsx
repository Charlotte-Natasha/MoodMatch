import React from 'react';
import { useNavigate } from 'react-router-dom';

const MoodPage = ({ 
    moodName, 
    bgColorVar, 
    moodImage,
    loading,      
    error,        
    playlists     
}) => {
    const navigate = useNavigate();
    
    // Set background style using the variable
    const moodStyle = { backgroundColor: `var(${bgColorVar})` };

    // --- NEW: Handler for clicking a playlist card ---
    // This function will navigate the user to a specific playlist detail route.
    const handlePlaylistClick = (playlistId) => {
        // Assuming your route for a specific playlist is '/playlist/:id'
        navigate(`/playlist/${playlistId}`);
    };
    // -------------------------------------------------

    if (loading || error) {
        // ... (loading/error state logic remains the same)
        return (
            <div style={moodStyle} className="p-8 text-center min-h-screen">
                {loading ? "Loading..." : "Error!"}
            </div>
        );
    }

    const playlistCount = playlists ? playlists.length : 0;

    return (
        <div style={moodStyle} className="p-8 min-h-screen">
            <header className="flex items-center justify-between mb-8">
                {/* Back Button remains the same */}
                <button
                    onClick={() => navigate('/moods-select')}
                    className="flex items-center text-white p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
                >
                    {/* ... SVG ... */}
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
                {playlists && playlists.map(playlist => (
                    // ---------------------------------------------------
                    // KEY CHANGE: Add onClick handler to the playlist div
                    // ---------------------------------------------------
                    <div 
                        key={playlist.id} 
                        // Call the handler, passing the playlist's ID
                        onClick={() => handlePlaylistClick(playlist.id)} 
                        className="bg-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                    >
                        <img src={playlist.imageUrl} alt={playlist.name} className="w-full aspect-square object-cover rounded shadow-md" />
                        <h3 className="text-white font-semibold mt-2 truncate">{playlist.name}</h3>
                        <p className="text-sm text-white/70">by {playlist.owner}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoodPage;