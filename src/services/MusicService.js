// MusicService.js - Uses Spotify User Authentication for playback

import { getValidAccessToken } from './SpotifyAuth';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// -------------------------------------------------------------------
// WEB PLAYER DEVICE MANAGEMENT 
// -------------------------------------------------------------------

let webPlayerDeviceId = null;

export const setWebPlayerDeviceId = (deviceId) => {
  webPlayerDeviceId = deviceId;
  console.log('Web player device ID set:', deviceId);
};

export const getWebPlayerDeviceId = () => {
  return webPlayerDeviceId;
};

// -------------------------------------------------------------------
// 1. FETCH PLAYLISTS BY MOOD
// -------------------------------------------------------------------

export async function fetchPlaylistsByMood(mood) {
    try {
        const token = await getValidAccessToken(); // Uses user token now!

        // Add variety words to get different results each time
        const varietyWords = ['vibes', 'hits', 'mix', 'best', 'top', 'new', 'songs', 'music', 'sexy', 'chill', 'party', 'workout'];
        const randomWord = varietyWords[Math.floor(Math.random() * varietyWords.length)];

        const query = `${mood} ${randomWord}`.trim().replace(/\s+/g, '+');
        const API_SEARCH_URL = `${SPOTIFY_API_BASE}/search?q=${query}&type=playlist&limit=20`;

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

// Shuffle and take only 20 playlists
        const playlists = data.playlists.items
            .map((item) => {
                if (!item || !item.id) return null;

                const imageUrl = item.images?.[0]?.url || null;

                return {
                    id: item.id,
                    name: item.name || "[Untitled Playlist]",
                    description: item.description,
                    imageUrl: imageUrl,
                    owner: item.owner?.display_name || "[Unknown Owner]",
                    uri: item.uri,
                };
            })
            .filter((item) => item !== null);

        // Shuffle the results
        return shuffleArray(playlists).slice(0, 20);
    } catch (error) {
        console.error("Error fetching playlists:", error);
        throw error;
    }
}

// -------------------------------------------------------------------
// 2. FETCH TRACKS FOR A PLAYLIST
// -------------------------------------------------------------------

export async function fetchPlaylistTracks(playlistId) {
    try {
        const token = await getValidAccessToken();

        const API_TRACKS_URL = `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`;
        const FIELDS = 'items(track(id,name,artists(name),album(name,images),duration_ms,uri))';

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
        
        return data.items
            .filter(item => item.track && item.track.id)
            .map(item => ({
                id: item.track.id,
                title: item.track.name,
                artist: item.track.artists.map(a => a.name).join(', '),
                album: item.track.album.name,
                albumImage: item.track.album.images?.[0]?.url,
                duration: item.track.duration_ms,
                uri: item.track.uri
            }));

    } catch (error) {
        console.error("Error fetching playlist tracks:", error);
        throw error;
    }
}

// -------------------------------------------------------------------
// 3. PLAYBACK FUNCTIONS (NEW!)
// -------------------------------------------------------------------

/**
 * Play a track or playlist on the active device
 */
export async function play(uri, deviceId = null) {
    try {
        const token = await getValidAccessToken();

        const finalDeviceId = deviceId || webPlayerDeviceId;

        if (!finalDeviceId) {
            throw new Error ('Web player not ready. Please wait a moment and try again')
        }

        const endpoint = deviceId 
            ? `${SPOTIFY_API_BASE}/me/player/play?device_id=${deviceId}`
            : `${SPOTIFY_API_BASE}/me/player/play`;

        // Determine if it's a track or context (playlist/album)
        const body = uri.includes('track')
            ? { uris: [uri] }
            : { context_uri: uri };

        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // 204 = success, 404 = no active device
        if (response.status === 404) {
            throw new Error('No active device found. Please open Spotify on a device or use the web player.');
        }

        if (!response.ok && response.status !== 204) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Playback failed');
        }

        return true;
    } catch (error) {
        console.error('Error playing track:', error);
        throw error;
    }
}

/**
 * Pause playback
 */
export async function pause() {
    try {
        const token = await getValidAccessToken();

        const response = await fetch(`${SPOTIFY_API_BASE}/me/player/pause`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok && response.status !== 204) {
            throw new Error('Failed to pause');
        }

        return true;
    } catch (error) {
        console.error('Error pausing:', error);
        throw error;
    }
}

/**
 * Resume playback
 */
export async function resume() {
    try {
        const token = await getValidAccessToken();

        const response = await fetch(`${SPOTIFY_API_BASE}/me/player/play`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok && response.status !== 204) {
            throw new Error('Failed to resume');
        }

        return true;
    } catch (error) {
        console.error('Error resuming:', error);
        throw error;
    }
}

/**
 * Skip to next track
 */
export async function skipToNext() {
    try {
        const token = await getValidAccessToken();

        const response = await fetch(`${SPOTIFY_API_BASE}/me/player/next`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok && response.status !== 204) {
            throw new Error('Failed to skip');
        }

        return true;
    } catch (error) {
        console.error('Error skipping:', error);
        throw error;
    }
}

/**
 * Skip to previous track
 */
export async function skipToPrevious() {
    try {
        const token = await getValidAccessToken();

        const response = await fetch(`${SPOTIFY_API_BASE}/me/player/previous`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok && response.status !== 204) {
            throw new Error('Failed to go back');
        }

        return true;
    } catch (error) {
        console.error('Error going back:', error);
        throw error;
    }
}

/**
 * Get current playback state
 */
export async function getCurrentPlayback() {
    try {
        const token = await getValidAccessToken();

        const response = await fetch(`${SPOTIFY_API_BASE}/me/player`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response.status === 204) {
            return null; // No active playback
        }

        if (!response.ok) {
            throw new Error('Failed to get playback state');
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting playback state:', error);
        return null;
    }
}

/**
 * Get available devices
 */
export async function getDevices() {
    try {
        const token = await getValidAccessToken();

        const response = await fetch(`${SPOTIFY_API_BASE}/me/player/devices`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get devices');
        }

        const data = await response.json();
        return data.devices;
    } catch (error) {
        console.error('Error getting devices:', error);
        throw error;
    }
}

/**
 * Set playback volume (0-100)
 */
export async function setVolume(volumePercent) {
    try {
        const token = await getValidAccessToken();

        const response = await fetch(
            `${SPOTIFY_API_BASE}/me/player/volume?volume_percent=${volumePercent}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        if (!response.ok && response.status !== 204) {
            throw new Error('Failed to set volume');
        }

        return true;
    } catch (error) {
        console.error('Error setting volume:', error);
        throw error;
    }
}

// Add this helper function at the bottom of MusicService.js
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Get recently played tracks from Spotify
 */
export async function getRecentlyPlayed(limitCount = 50) {
    try {
        const token = await getValidAccessToken();

        const response = await fetch(
            `${SPOTIFY_API_BASE}/me/player/recently-played?limit=${limitCount}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to get recently played');
        }

        const data = await response.json();
        
        return data.items.map(item => ({
            trackName: item.track.name,
            artist: item.track.artists.map(a => a.name).join(', '),
            album: item.track.album.name,
            albumImage: item.track.album.images?.[0]?.url,
            playedAt: item.played_at,
            uri: item.track.uri
        }));
    } catch (error) {
        console.error('Error getting recently played:', error);
        return [];
    }
}

/**
 * Play track/playlist on web player device
 */
export async function playOnWebPlayer(uri, deviceId) {
    try {
        const token = await getValidAccessToken();

        const endpoint = `${SPOTIFY_API_BASE}/me/player/play?device_id=${deviceId}`;

        // Determine if it's a track or context (playlist/album)
        const body = uri.includes('track')
            ? { uris: [uri] }
            : { context_uri: uri };

        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok && response.status !== 204) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Playback failed');
        }

        return true;
    } catch (error) {
        console.error('Error playing on web player:', error);
        throw error;
    }
}