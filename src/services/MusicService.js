// Access environment variables using Vite's standard method
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// --- Spotify API Endpoints ---
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// --- Internal Token Management State ---
let accessToken = null;
let tokenExpiryTime = 0; // Timestamp when the token expires

/**
 * Fetches or returns a valid Spotify Access Token (App Access Token).
 * Uses the Client ID and Secret for the Client Credentials Flow.
 */
async function getAccessToken() {
    // Check if current token is valid (with a 60-second buffer)
    if (accessToken && Date.now() < tokenExpiryTime - 60000) {
        return accessToken;
    }

    // Prepare credentials for Basic Auth (Base64 encoding)
    const authString = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);

    try {
        const response = await fetch(SPOTIFY_TOKEN_URL, {
            method: "POST",
            headers: {
                Authorization: `Basic ${authString}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials",
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Spotify Auth Error: ${response.status} - ${errorBody}`);
        }

        const data = await response.json();
        
        accessToken = data.access_token;
        // Calculate new expiry time: current time + expires_in seconds * 1000
        tokenExpiryTime = Date.now() + data.expires_in * 1000;

        return accessToken;
    } catch (error) {
        console.error("Failed to get Spotify Access Token:", error);
        throw new Error("Could not connect to Spotify authentication service.");
    }
}

// -------------------------------------------------------------------
// 1. FUNCTION TO FETCH PLAYLISTS BY MOOD
// -------------------------------------------------------------------

/**
 * Fetches playlists based on a mood keyword using the Access Token.
 */
export async function fetchPlaylistsByMood(mood) {
    try {
        const token = await getAccessToken(); // Get a valid token first!

        // Search Query: Use the mood keyword, filter by playlist, set a limit
        const query = `mood+${mood}`;
        const API_SEARCH_URL = `${SPOTIFY_API_BASE}/search?q=${query}&type=playlist&limit=5`;

        const response = await fetch(API_SEARCH_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Spotify API Search Error: ${response.status}`);
        }

        const data = await response.json();

        return data.playlists.items
            .map((item) => {
                // Defensive check for null/invalid items
                if (!item || !item.id) {
                    console.warn("Skipping null/invalid playlist item.");
                    return null;
                }

                // Safely access the image URL
                const imageUrl =
                    item.images && item.images.length > 0
                        ? item.images[item.images.length - 1].url
                        : null;

                return {
                    id: item.id,
                    name: item.name || "[Untitled Playlist]",
                    description: item.description,
                    imageUrl: imageUrl,
                    owner: item.owner ? item.owner.display_name : "[Unknown Owner]",
                    uri: item.uri,
                };
            })
            .filter((item) => item !== null); // Filter out any null items
    } catch (error) {
        console.error("Error fetching playlists:", error);
        throw error;
    }
}

// -------------------------------------------------------------------
// 2. FUNCTION TO FETCH TRACKS FOR A PLAYLIST
// -------------------------------------------------------------------

/**
 * Fetches the list of tracks for a specific Spotify Playlist ID.
 */
export async function fetchPlaylistTracks(playlistId) {
    try {
        const token = await getAccessToken(); // Get a valid token

        // Endpoint for getting a playlist's tracks
        const API_TRACKS_URL = `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`;

        // We limit the fields for efficiency
        const FIELDS = 'items(track(id,name,artists(name),album(name),duration_ms,uri))';

        const response = await fetch(`${API_TRACKS_URL}?fields=${FIELDS}&limit=50`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch tracks: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Normalize the tracks data
        return data.items
            .filter(item => item.track) // Filter out items that are not valid tracks
            .map(item => ({
                id: item.track.id,
                title: item.track.name,
                artist: item.track.artists.map(a => a.name).join(', '),
                album: item.track.album.name,
                duration: item.track.duration_ms, // Duration in milliseconds
                uri: item.track.uri // Spotify URI needed for playback
            }));

    } catch (error) {
        console.error("Error fetching playlist tracks:", error);
        throw error;
    }
}