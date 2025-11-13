// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Main Pages
import WelcomeScreen from './components/WelcomeScreen';
import Moods from './components/Moods';
import History from './components/History';
import Player from './components/Player';
import Profile from './components/Profile';

// Individual Mood Pages
import ChillPage from './components/MoodPage/Chill.jsx';
import EnergeticPage from './components/MoodPage/Energetic.jsx';
import FocusedPage from './components/MoodPage/Focused.jsx';
import HappyPage from './components/MoodPage/Happy.jsx';
import RomanticPage from './components/MoodPage/Romantic.jsx';
import SadPage from './components/MoodPage/Sad.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Welcome / Onboarding */}
        <Route path="/" element={<WelcomeScreen />} />

        {/* Mood Selection Grid */}
        <Route path="/moods-select" element={<Moods />} />

        {/* Redirect /mood to /moods-select */}
        <Route path="/mood" element={<Navigate to="/moods-select" replace />} />

        {/* Individual Mood Pages */}
        <Route path="/mood/chill" element={<ChillPage />} />
        <Route path="/mood/energetic" element={<EnergeticPage />} />
        <Route path="/mood/focused" element={<FocusedPage />} />
        <Route path="/mood/happy" element={<HappyPage />} />
        <Route path="/mood/romantic" element={<RomanticPage />} />
        <Route path="/mood/sad" element={<SadPage />} />

        {/* Other App Screens */}
        <Route path="/player" element={<Player />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
