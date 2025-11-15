const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// --- Internal Token Management State ---
let accessToken = null;
let tokenExpiryTime = 0; // Timestamp when the token expires

/**
 * Step 1: Fetches or returns a valid Spotify Access Token.
 */
async function getAccessToken() {
  // Check if current token is valid (with a 60-second buffer)
  if (accessToken && Date.now() < tokenExpiryTime - 60000) {
    return accessToken;
  }

  // Prepare credentials for Basic Auth
  const authString = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error(`Spotify Auth Error: ${response.statusText}`);
    }

    const data = await response.json();

    accessToken = data.access_token;
    // Calculate new expiry time: current time + expires_in seconds * 1000
    tokenExpiryTime = Date.now() + data.expires_in * 1000;

    return accessToken;
  } catch (error) {
    console.error("Failed to get Spotify Access Token:", error);
    throw new Error("Could not connect to Spotify service.");
  }
}

/**
 * Step 2: Fetches playlists based on a mood keyword using the Access Token.
 * @param {string} mood - The user-selected mood (e.g., 'chill', 'happy').
 */
export async function fetchPlaylistsByMood(mood) {
  try {
    const token = await getAccessToken(); // Get a valid token first!

    // Search Query: Use the mood keyword, filter by playlist, set a limit
    const query = `mood+${mood}`;
    const API_SEARCH_URL = `https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=5`;

    const response = await fetch(API_SEARCH_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Use the token here
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API Search Error: ${response.status}`);
    }

    const data = await response.json();

    return (
      data.playlists.items
        .map((item) => {
          // 1. Skip the entire item if it's null, undefined, or missing an ID
          if (!item || !item.id) {
            // Return null or skip this item. Returning null requires a filter step later.
            console.warn("Skipping null/invalid playlist item.");
            return null;
          }

          // 2. Safely access the image URL
          // Check if item.images exists and has at least one element before trying to access url
          const imageUrl =
            item.images && item.images.length > 0
              ? item.images[item.images.length - 1].url
              : null;

          return {
            id: item.id,
            name: item.name || "[Untitled Playlist]", // Safely provide a fallback
            description: item.description,
            imageUrl: imageUrl,
            owner: item.owner ? item.owner.display_name : "[Unknown Owner]",
            uri: item.uri,
          };
        })
        // 3. Filter out any null items that were skipped in step 1
        .filter((item) => item !== null)
    );
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
}
