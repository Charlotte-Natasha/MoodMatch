import React from 'react';
import MoodPage from './MoodPage.jsx';
import happyImage from '../../assets/Sad.png';

const HappyPage = () => (
  <MoodPage
    moodName="Sad"
    bgColorVar="--color-mood-sad"
    playlistCount={12}
    moodImage={happyImage}
  />
);

export default HappyPage;
