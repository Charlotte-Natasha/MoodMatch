import React from 'react';
import MoodPage from './MoodPage.jsx';
import chillImage from '../../assets/Chill.png';
import { useMoodPlaylists } from '../../hooks/useMoodPlaylists.js'; 


const ChillPage = () => {
    // 2. Call the hook, passing the mood keyword
    const { playlists, loading, error } = useMoodPlaylists('chill');

    // 3. Render the reusable MoodPage, passing the data/state
    return (
        <MoodPage
            moodName="Chill"
            bgColorVar="--color-mood-chill"
            loading={loading}
            error={error}
            playlists={playlists} 
            moodImage={chillImage}
        />
    );
};

export default ChillPage;