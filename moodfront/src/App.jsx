import React from 'react';
// 1. Import Router Components
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 2. Import Your Page Components
// Note: Rename 'Screen' to 'WelcomeScreen' or 'OnboardingScreen' for clarity
import WelcomeScreen from './components/WelcomeScreen'; 
import Moods from './components/Moods'; 
import Playlist from './components/Playlist';
import History from './components/History';
import Player from './components/Player';
import Profile from './components/Profile';

// A Layout or Navbar component is often wrapped around pages that share elements
// import Layout from './components/Layout'; 

function App() {
  return (
    // The Router component is the heart of the navigation system
    <Router>
      {/* Routes define the paths for your application */}
      <Routes>
        
        {/* 1. Welcome / Onboarding (The entry point) */}
        <Route path="/" element={<WelcomeScreen />} />
        
        {/* 2. Mood Selection Screen (After clicking 'Get Started') */}
        <Route path="/moods" element={<Moods />} />

        {/* 3. Playlist Recommendation Screen */}
        <Route path="/playlists/:moodId" element={<Playlist />} />

        {/* 4. Now Playing Screen (Often a modal or separate full screen) */}
        <Route path="/player" element={<Player />} /> 

        {/* 5. Optional: Saved Moods / Favorites (Could be handled by History or Profile) */}
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Optional: 404 Page */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;