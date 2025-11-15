import { useState, useEffect } from 'react';
import { fetchPlaylistsByMood } from '../services/MusicService'; // Import the new function

export function useMoodPlaylists(mood) {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadPlaylists() {
            setLoading(true);
            setError(null);
            try {
                const playlistData = await fetchPlaylistsByMood(mood);
                setPlaylists(playlistData);
            } catch (err) {
                setError(err.message || "An unknown error occurred while fetching playlists.");
                setPlaylists([]);
            } finally {
                setLoading(false);
            }
        }
        
        if (mood) {
            loadPlaylists();
        }

    }, [mood]); // Effect runs when the mood changes

    return { playlists, loading, error };
}