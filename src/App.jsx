import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn as isSpotifyConnected } from './services/SpotifyAuth';

// Contexts
import { PlaybackProvider, usePlayback } from './contexts/PlaybackContext.jsx'; 

// Components
import SpotifyPlayer from './components/SpotifyPlayer.jsx'; 

// Authentication Pages
import SpotifyLoginPage from './pages/SpotifyLogin.jsx';
import SpotifyCallback from './pages/SpotifyCallback.jsx';

// Main Pages
import WelcomeScreen from './pages/WelcomeScreen.jsx';
import Moods from './pages/Moods.jsx';
import History from './components/History.jsx';
import PlaylistDetail from './components/PlaylistDetails.jsx'; 
import Profile from './pages/Profile.jsx';

// Mood Pages 
import HappyPage from './components/MoodPage/Happy.jsx';
import SadPage from './components/MoodPage/Sad.jsx';
import ChillPage from './components/MoodPage/Chill.jsx';
import EnergeticPage from './components/MoodPage/Energetic.jsx';
import FocusedPage from './components/MoodPage/Focused.jsx';
import RomanticPage from './components/MoodPage/Romantic.jsx';

// -------------------------------------------------------------
// Protected Route Component (Replaces PrivateRoute)
// -------------------------------------------------------------
function ProtectedRoute({ children }) {
    if (!isSpotifyConnected()) {
        return <Navigate to="/spotify-login" replace />;
    }
    return children;
}

// -------------------------------------------------------------
// Content Wrapper (Handles Router and Global Player)
// -------------------------------------------------------------
function AppContent() {
    const { currentUri } = usePlayback(); 

    return (
        <Router>
            <Routes>
                {/* ========================================= */}
                {/* 📢 PUBLIC ROUTES (No Spotify login)      */}
                {/* ========================================= */}
                <Route 
                    path='/' 
                    element={
                        isSpotifyConnected() 
                            ? <Navigate to="/moods-select" replace /> 
                            : <WelcomeScreen />
                    } 
                />
                
                <Route 
                    path='/spotify-login' 
                    element={
                        isSpotifyConnected() 
                            ? <Navigate to="/moods-select" replace /> 
                            : <SpotifyLoginPage />
                    } 
                />

                {/* Spotify OAuth Callback */}
                <Route path="/callback" element={<SpotifyCallback />} />

                {/* ========================================= */}
                {/* 🔒 PROTECTED ROUTES (Spotify login req)  */}
                {/* ========================================= */}
                
                {/* Mood Selection */}
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
                
                {/* Individual Mood Pages */}
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
                    path="/profile" 
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } 
                />

                {/* 404 - Redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
                
            </Routes>

            {/* Global Player Component (shown on all pages) */}
            {currentUri && <SpotifyPlayer uri={currentUri} />}
        </Router>
    );
}

// -------------------------------------------------------------
// Main App (Provides Contexts)
// -------------------------------------------------------------
function App() {
    return (
        <PlaybackProvider> 
            <AppContent />
        </PlaybackProvider>
    );
}

export default App;