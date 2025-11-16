// SpotifyCallback.jsx - Handles the redirect from Spotify

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleCallback } from "../services/SpotifyAuth";

function SpotifyCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      // Get the authorization code from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error");

      if (error) {
        setError(`Authentication failed: ${error}`);
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      if (!code) {
        setError("No authorization code found");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      try {
        // Exchange code for access token
        await handleCallback(code);

        // Success! Redirect to main app
        navigate("/");
      } catch (err) {
        console.error("Callback error:", err);
        setError(err.message);
        setTimeout(() => navigate("/"), 3000);
      }
    };

    processCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ {error}</div>
          <p className="text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-white text-xl">Connecting to Spotify...</p>
      </div>
    </div>
  );
}

export default SpotifyCallback;
