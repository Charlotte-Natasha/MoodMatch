import React, { useState, useEffect } from 'react';
import { setWebPlayerDeviceId } from '../services/MusicService'

function SpotifyWebPlayer({ accessToken }) {
  const [player, setPlayer] = useState(null);
  const [currentTrack] = useState(null);
  const [isPlaying] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    // Load Spotify Web Playback SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'MoodMatch Web Player',
        getOAuthToken: cb => { cb(accessToken); },
        volume: 0.5
      });

      // Error handling
      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Initialization Error:', message);
      });

      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Authentication Error:', message);
      });

      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Account Error:', message);
      });

      spotifyPlayer.addListener('playback_error', ({ message }) => {
        console.error('Playback Error:', message);
      });

      // Ready
      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setWebPlayerDeviceId(device_id);
      });

      // Not Ready
      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setWebPlayerDeviceId(null);
      });

      // Player state changed

      // Connect to the player
      spotifyPlayer.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      });

      setPlayer(spotifyPlayer);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken]);

  const togglePlay = () => {
    if (player) {
      player.togglePlay();
    }
  };

  const nextTrack = () => {
    if (player) {
      player.nextTrack();
    }
  };

  const previousTrack = () => {
    if (player) {
      player.previousTrack();
    }
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-linear-to-r from-gray-900 via-purple-900/20 to-gray-900 border-t border-purple-500/20 p-4 shadow-2xl z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Album Art */}
        <img
          src={currentTrack.album.images[0]?.url}
          alt={currentTrack.name}
          className="w-16 h-16 rounded-lg shadow-lg object-cover ring-2 ring-purple-500/30"
        />

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold truncate text-lg">
            {currentTrack.name}
          </h4>
          <p className="text-gray-400 text-sm truncate">
            {currentTrack.artists.map(artist => artist.name).join(', ')}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={previousTrack}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/>
            </svg>
          </button>

          <button
            onClick={togglePlay}
            className="bg-white text-black rounded-full p-3 hover:scale-110 transition-transform shadow-lg"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
              </svg>
            )}
          </button>

          <button
            onClick={nextTrack}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/>
            </svg>
          </button>
        </div>

        {/* Volume Indicator */}
        <div className="hidden md:flex items-center gap-2 text-white/60 text-sm">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default SpotifyWebPlayer;