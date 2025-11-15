import React from 'react';
import MoodPage from './MoodPage.jsx';
import focusedImage from '../../assets/Focused.png';
import { useMoodPlaylists } from '../../hooks/useMoodPlaylists.js'; 


const FocusedPage = () => {
    // 2. Call the hook, passing the mood keyword
    const { playlists, loading, error } = useMoodPlaylists('focused');

    // 3. Render the reusable MoodPage, passing the data/state
    return (
        <MoodPage
            moodName="Focused"
            bgColorVar="--color-mood-focused"
            loading={loading}
            error={error}
            playlists={playlists} 
            moodImage={focusedImage}
        />
    );
};

export default FocusedPage;