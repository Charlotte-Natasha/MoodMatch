import { useState, useEffect } from "react";
import { fetchPlaylistTracks } from "../services/MusicService";

export function usePlaylistTracks(playlistId) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!playlistId) return;

    async function loadTracks() {
      setLoading(true);
      setError(null);
      try {
        const trackList = await fetchPlaylistTracks(playlistId);
        setTracks(trackList);
      } catch (err) {
        setError(
          err.message || "An unknown error occurred while fetching tracks."
        );
        setTracks([]);
      } finally {
        setLoading(false);
      }
    }

    loadTracks();
  }, [playlistId]); // Re-run effect if the playlistId changes

  return { tracks, loading, error };
}
