import React from 'react';
import MoodPage from './MoodPage.jsx';
import romanceImage from '../../assets/Romance.png';
import { useMoodPlaylists } from '../../hooks/useMoodPlaylists.js'; 


const RomanticPage = () => {
    // 2. Call the hook, passing the mood keyword
    const { playlists, loading, error } = useMoodPlaylists('romantic');

    // 3. Render the reusable MoodPage, passing the data/state
    return (
        <MoodPage
            moodName="Romantic"
            bgColorVar="--color-mood-romantic"
            loading={loading}
            error={error}
            playlists={playlists} 
            moodImage={romanceImage}
        />
    );
};

export default RomanticPage;