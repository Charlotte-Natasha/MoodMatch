import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Authentication Pages
import SignUp from './components/Authentication/SignUp.jsx';
import LogIn from './components/Authentication/LogIn.jsx';

// Main Pages
import WelcomeScreen from './pages/WelcomeScreen.jsx';
import Moods from './pages/Moods.jsx';
import History from './components/History.jsx';
import Player from './components/Player.jsx';
import Profile from './pages/Profile.jsx';

// Mood Pages
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
        {/* Authentication */}
        <Route path='/' element={<SignUp />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<LogIn />} />

        {/* Welcome */}
        <Route path='/welcome' element={<WelcomeScreen />} />

        {/* Mood Selection */}
        <Route path="/moods-select" element={<Moods />} />

        {/* Redirect /mood to mood selection */}
        <Route path="/mood" element={<Navigate to="/moods-select" replace />} />

        {/* Individual Mood Pages */}
        <Route path="/mood/chill" element={<ChillPage />} />
        <Route path="/mood/energetic" element={<EnergeticPage />} />
        <Route path="/mood/focused" element={<FocusedPage />} />
        <Route path="/mood/happy" element={<HappyPage />} />
        <Route path="/mood/romantic" element={<RomanticPage />} />
        <Route path="/mood/sad" element={<SadPage />} />

        {/* Other Screens */}
        <Route path="/player" element={<Player />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
