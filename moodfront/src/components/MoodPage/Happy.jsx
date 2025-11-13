import React from 'react';
import MoodPage from './MoodPage.jsx';
import happyImage from '../../assets/Happy.png';

const HappyPage = () => (
  <MoodPage
    moodName="Happy"
    bgColorVar="--color-mood-happy"
    playlistCount={12}
    moodImage={happyImage}
  />
);

export default HappyPage;
