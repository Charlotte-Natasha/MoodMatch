import React from 'react';
import MoodPage from './MoodPage.jsx';
import happyImage from '../../assets/Energetic.png';
import { useMoodPlaylists } from '../../hooks/useMoodPlaylists.js'; 


const  EnergeticPage = () => {
    // 2. Call the hook, passing the mood keyword
    const { playlists, loading, error } = useMoodPlaylists('energetic');

    // 3. Render the reusable MoodPage, passing the data/state
    return (
        <MoodPage
            moodName="Energetic"
            bgColorVar="--color-mood-energetic"
            loading={loading}
            error={error}
            playlists={playlists} 
            moodImage={happyImage}
        />
    );
};

export default EnergeticPage;