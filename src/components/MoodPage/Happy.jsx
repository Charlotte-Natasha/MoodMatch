import React from 'react';
import MoodPage from './MoodPage.jsx';
import happyImage from '../../assets/Happy.png';
import { useMoodPlaylists } from '../../hooks/useMoodPlaylists.js'; 


const HappyPage = () => {
    // 2. Call the hook, passing the mood keyword
    const { playlists, loading, error } = useMoodPlaylists('happy');

    // 3. Render the reusable MoodPage, passing the data/state
    return (
        <MoodPage
            moodName="Happy"
            bgColorVar="--color-mood-happy"
            loading={loading}
            error={error}
            playlists={playlists} 
            moodImage={happyImage}
        />
    );
};

export default HappyPage;