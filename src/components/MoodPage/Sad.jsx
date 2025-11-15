import React from 'react';
import MoodPage from './MoodPage.jsx';
import sadImage from '../../assets/Sad.png';
import { useMoodPlaylists } from '../../hooks/useMoodPlaylists.js'; 


const SadPage = () => {
    // 2. Call the hook, passing the mood keyword
    const { playlists, loading, error } = useMoodPlaylists('sad');

    // 3. Render the reusable MoodPage, passing the data/state
    return (
        <MoodPage
            moodName="Sad"
            bgColorVar="--color-mood-sad"
            loading={loading}
            error={error}
            playlists={playlists} 
            moodImage={sadImage}
        />
    );
};

export default SadPage;