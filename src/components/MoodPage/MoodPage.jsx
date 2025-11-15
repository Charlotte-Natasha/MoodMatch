import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

// Update props signature to match what HappyPage now sends
const MoodPage = ({ 
    moodName, 
    bgColorVar, 
    moodImage,
    loading,      
    error,        
    playlists     
}) => {
    // 2. Initialize the hook inside the component
    const navigate = useNavigate();
    
    // Set background style using the variable
    const moodStyle = { backgroundColor: `var(${bgColorVar})` };

    // --- Conditional Rendering for Data States (omitted for brevity) ---

    if (loading) {
        // ... (loading state logic)
        return (
            <div style={moodStyle} className="p-8 text-center min-h-screen">
                {/* ... loading content ... */}
            </div>
        );
    }

    if (error) {
        // ... (error state logic)
        return (
            <div style={moodStyle} className="p-8 text-center min-h-screen">
                {/* ... error content ... */}
            </div>
        );
    }

    // --- Main Content Rendering (Playlists Found) ---
    const playlistCount = playlists ? playlists.length : 0;

    return (
        <div style={moodStyle} className="p-8 min-h-screen">
            <header className="flex items-center justify-between mb-8">
                
                {/* 3. Back Button Implementation */}
                <button
                    onClick={() => navigate('/moods-select')} // Navigate directly to the mood selection page
                    // Alternatively, use navigate(-1) to go back to the previous page in history
                    // onClick={() => navigate(-1)} 
                    className="flex items-center text-white p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
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
                {/* Map over the fetched playlists and render a card for each */}
                {playlists && playlists.map(playlist => (
                    // In a real app, you'd use a dedicated component here:
                    // <PlaylistCard key={playlist.id} playlist={playlist} />
                    <div key={playlist.id} className="bg-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
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