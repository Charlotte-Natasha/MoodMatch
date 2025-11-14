import React from 'react';
import MoodPage from './MoodPage.jsx';
import energeticImage from '../../assets/Energetic.png';

const Energetic = () => {
  return (
    <MoodPage
      moodName="Energetic"
      bgColorVar="--color-mood-energetic"
      moodImage={energeticImage}
    />
  );
};

export default Energetic;