import { useState, useEffect } from 'react';

export const useFetchPlaylists = (moodName) => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!moodName) return;

    setLoading(true);
    setError(null);

    // Example API URL - replace with your actual endpoint
    const url = `https://api.example.com/playlists?mood=${encodeURIComponent(moodName)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Assuming the API returns playlists array in data.playlists
        setPlaylists(data.playlists || []);
      })
      .catch((err) => {
        setError(err.message || 'Unknown error');
      })
      .finally(() => setLoading(false));
  }, [moodName]);

  return { playlists, isLoading, error };
};
