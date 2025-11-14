import React from 'react';
import MoodPage from './MoodPage.jsx';
import romanticImage from '../../assets/Romance.png';

const Romantic = () => {
  return (
    <MoodPage
      moodName="Romance"
      bgColorVar="--color-mood-romantic"
      moodImage={romanticImage}
    />
  );
};

export default Romantic;