import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SpotifyWebPlayer from './components/SpotifyWebPlayer.jsx';
import { getValidAccessToken, isLoggedIn as isSpotifyConnected } from "./services/SpotifyAuth";

// Contexts
import { PlaybackProvider } from "./contexts/PlaybackContext.jsx";
import { WebPlayerProvider } from "./contexts/WebPlayerContext.jsx";

// Pages
import SpotifyLoginPage from "./pages/SpotifyLogin.jsx";
import SpotifyCallback from "./pages/SpotifyCallback.jsx";
import WelcomeScreen from "./pages/WelcomeScreen.jsx";
import Moods from "./pages/Moods.jsx";
import History from "./components/History.jsx";
import PlaylistDetail from "./components/PlaylistDetails.jsx";
import Profile from "./pages/Profile.jsx";
import Favorites from "./pages/Favorites.jsx";

// Mood Pages
import HappyPage from "./components/MoodPage/Happy.jsx";
import SadPage from "./components/MoodPage/Sad.jsx";
import ChillPage from "./components/MoodPage/Chill.jsx";
import EnergeticPage from "./components/MoodPage/Energetic.jsx";
import FocusedPage from "./components/MoodPage/Focused.jsx";
import RomanticPage from "./components/MoodPage/Romantic.jsx";

// -------------------------------------------------------------
// Protected Route Component
// -------------------------------------------------------------
function ProtectedRoute({ children }) {
  if (!isSpotifyConnected()) {
    return <Navigate to="/login" replace />; // ✅ Redirect to login instead of /callback
  }
  return children;
}

// -------------------------------------------------------------
// App Content
// -------------------------------------------------------------
function AppContent() {
  const [accessToken, setAccessToken] = useState(null);

  // Load token for Web Player
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await getValidAccessToken();
        if (token) setAccessToken(token);
      } catch (err) {
        console.error("Error loading token:", err);
      }
    };

    if (isSpotifyConnected()) {
      loadToken();
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* ========================================= */}
        {/* PUBLIC ROUTES */}
        {/* ========================================= */}
        <Route
          path="/"
          element={
            isSpotifyConnected() ? (
              <Navigate to="/moods-select" replace />
            ) : (
              <WelcomeScreen />
            )
          }
        />

        <Route path="/login" element={<SpotifyLoginPage />} />
        <Route path="/callback" element={<SpotifyCallback />} />

        {/* ========================================= */}
        {/* PROTECTED ROUTES */}
        {/* ========================================= */}
        <Route
          path="/moods-select"
          element={
            <ProtectedRoute>
              <Moods />
            </ProtectedRoute>
          }
        />

        {/* Redirect /mood to /moods-select */}
        <Route path="/mood" element={<Navigate to="/moods-select" replace />} />

        {/* Mood Pages */}
        <Route
          path="/mood/chill"
          element={
            <ProtectedRoute>
              <ChillPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mood/energetic"
          element={
            <ProtectedRoute>
              <EnergeticPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mood/focused"
          element={
            <ProtectedRoute>
              <FocusedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mood/happy"
          element={
            <ProtectedRoute>
              <HappyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mood/romantic"
          element={
            <ProtectedRoute>
              <RomanticPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mood/sad"
          element={
            <ProtectedRoute>
              <SadPage />
            </ProtectedRoute>
          }
        />

        {/* Other Protected Pages */}
        <Route
          path="/playlist/:id"
          element={
            <ProtectedRoute>
              <PlaylistDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Spotify Web Player */}
      {accessToken && <SpotifyWebPlayer accessToken={accessToken} />}
    </Router>
  );
}

// -------------------------------------------------------------
// Main App (Contexts)
// -------------------------------------------------------------
function App() {
  return (
    <WebPlayerProvider>
      <PlaybackProvider>
        <AppContent />
      </PlaybackProvider>
    </WebPlayerProvider>
  );
}

export default App;
