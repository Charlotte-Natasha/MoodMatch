import React from 'react';
import MoodPage from './MoodPage.jsx';
import chillImage from '../../assets/Chill.png';

const Chill = () => {
  return (
    <MoodPage
      moodName="Chill"
      bgColorVar="--color-mood-chill"
      moodImage={chillImage}
    />
  );
};

export default Chill;