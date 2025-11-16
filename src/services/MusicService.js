// MusicService.js - Uses Spotify User Authentication for playback

import { getValidAccessToken } from './SpotifyAuth';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// -------------------------------------------------------------------
// 1. FETCH PLAYLISTS BY MOOD
// -------------------------------------------------------------------

export async function fetchPlaylistsByMood(mood) {
    try {
        const token = await getValidAccessToken(); // Uses user token now!

        const query = `${mood}`;
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

        return data.playlists.items
            .map((item) => {
                if (!item || !item.id) {
                    return null;
                }

                const imageUrl =
                    item.images && item.images.length > 0
                        ? item.images[0].url
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
            .filter((item) => item !== null);
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