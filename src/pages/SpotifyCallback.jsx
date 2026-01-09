import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleCallback } from "../services/SpotifyAuth";
import WelcomeScreen from "./WelcomeScreen.jsx";

function SpotifyCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {

      // Extract code and error from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const authError = params.get("error");

      if (authError) {
        setError(`Authentication failed: ${authError}`);
        setTimeout(() => navigate("/", { replace: true }), 3000);
        return;
      }

      if (!code) {
        setError("No authorization code found");
        setTimeout(() => navigate("/", { replace: true }), 3000);
        return;
      }

      try {
        await handleCallback(code);
        // success → redirect to moods
        navigate("/moods-select", { replace: true });
      } catch (err) {
        console.error("Callback error:", err);
        setError(err.message);
        setTimeout(() => navigate("/", { replace: true }), 3000);
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

  // While processing, show your WelcomeScreen loader
  return <WelcomeScreen redirecting={true} />;
}

export default SpotifyCallback;
