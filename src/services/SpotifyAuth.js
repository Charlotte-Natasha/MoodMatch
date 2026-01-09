// SpotifyAuth.js - Spotify Authorization Code Flow with PKCE

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI =
  import.meta.env.VITE_SPOTIFY_REDIRECT_URI || "http://localhost:5173/callback";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

// Required scopes for playback and user data
const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "playlist-read-private",
  'user-read-recently-played',
  "playlist-read-collaborative",
].join(" ");

// --- PKCE Helper Functions ---

/**
 * Generates a random code verifier for PKCE
 */
function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

/**
 * Creates a code challenge from the verifier
 */
async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64URLEncode(new Uint8Array(hash));
}

/**
 * Base64 URL encoding (without padding)
 */
function base64URLEncode(array) {
  return btoa(String.fromCharCode.apply(null, array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// --- Authentication Functions ---

/**
 * Redirects user to Spotify login page
 */
export async function loginWithSpotify() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store code verifier in localStorage for later use
  localStorage.setItem("spotify_code_verifier", codeVerifier);

  // Build authorization URL
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  // Redirect to Spotify authorization page
  window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Exchanges authorization code for access token
 */
export async function handleCallback(code) {
  const codeVerifier = localStorage.getItem("spotify_code_verifier");

  if (!codeVerifier) {
    throw new Error("Code verifier not found. Please login again.");
  }

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Token exchange failed: ${error.error_description}`);
    }

    const data = await response.json();

    // Store tokens
    localStorage.setItem("spotify_access_token", data.access_token);
    localStorage.setItem("spotify_refresh_token", data.refresh_token);
    localStorage.setItem(
      "spotify_token_expiry",
      Date.now() + data.expires_in * 1000
    );

    // Clean up code verifier
    localStorage.removeItem("spotify_code_verifier");

    return data.access_token;
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    throw error;
  }
}

/**
 * Refreshes the access token using refresh token
 */
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("spotify_refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token available. Please login again.");
  }

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();

    // Update stored tokens
    localStorage.setItem("spotify_access_token", data.access_token);
    localStorage.setItem(
      "spotify_token_expiry",
      Date.now() + data.expires_in * 1000
    );

    if (data.refresh_token) {
      localStorage.setItem("spotify_refresh_token", data.refresh_token);
    }

    return data.access_token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    // If refresh fails, clear everything and require re-login
    logout();
    throw error;
  }
}

/**
 * Gets a valid access token (refreshes if needed)
 */
export async function getValidAccessToken() {
  const token = localStorage.getItem("spotify_access_token");
  const expiry = localStorage.getItem("spotify_token_expiry");

  if (token && expiry && Date.now() < parseInt(expiry) - 60000) {
    return token;
  }

  try {
    return await refreshAccessToken();
  } catch {
    logout();               // clear broken tokens
    return null;            // IMPORTANT: do NOT throw
  }
}

/**
 * Checks if user is logged in
 */
export function isLoggedIn() {
  return !!localStorage.getItem("spotify_access_token");
}

/**
 * Logs out user
 */
export function logout() {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_refresh_token");
  localStorage.removeItem("spotify_token_expiry");
  localStorage.removeItem("spotify_code_verifier");
}

/**
 * Gets current user info
 */
export async function getCurrentUser() {
  const token = await getValidAccessToken();

  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user info");
  }

  return await response.json();
}
