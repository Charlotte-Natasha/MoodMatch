import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Contexts and Hooks
import { PlaybackProvider, usePlayback } from './contexts/PlaybackContext.jsx'; 
// Components
import PrivateRoute from './components/PrivateRoute.jsx'; 
import SpotifyPlayer from './components/SpotifyPlayer.jsx'; 

// Authentication Page
import SpotifyLoginPage from './pages/SpotifyLogin.jsx';

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
// 1. Content Wrapper (Handles Router and Global Player)
// -------------------------------------------------------------
function AppContent() {
    const { currentUri } = usePlayback(); 

    return (
        <Router>
            <Routes>
                {/* ========================================= */}
                {/* 📢 PUBLIC ROUTES (No login required)     */}
                {/* ========================================= */}
                <Route path='/' element={<WelcomeScreen />} />
                <Route path='/spotify-login' element={<SpotifyLoginPage/>} />

                {/* ========================================= */}
                {/* 🔒 PRIVATE ROUTES (Login required)       */}
                {/* ========================================= */}
                <Route element={<PrivateRoute />}>
                    
                    {/* Welcome & Moods */}
                    <Route path="/moods-select" element={<Moods />} />
                    <Route path="/mood" element={<Navigate to="/moods-select" replace />} />
                    
                    {/* Individual Mood Pages */}
                    <Route path="/mood/chill" element={<ChillPage />} />
                    <Route path="/mood/energetic" element={<EnergeticPage />} />
                    <Route path="/mood/focused" element={<FocusedPage />} />
                    <Route path="/mood/happy" element={<HappyPage />} />
                    <Route path="/mood/romantic" element={<RomanticPage />} />
                    <Route path="/mood/sad" element={<SadPage />} />

                    {/* Other Screens */}
                    {/* CRITICAL FIX: Use a dynamic path for the Playlist Detail page */}
                    <Route path="/playlist/:id" element={<PlaylistDetail />} /> 
                    <Route path="/history" element={<History />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
                
            </Routes>
            {/* 3. Global Player Component (placed outside Routes) */}
            <SpotifyPlayer uri={currentUri} /> 
        </Router>
    );
}

// -------------------------------------------------------------
// 2. Main App (Provides Contexts)
// -------------------------------------------------------------
function App() {
    return (
        <PlaybackProvider> 
            <AppContent />
        </PlaybackProvider>
    );
}

export default App;