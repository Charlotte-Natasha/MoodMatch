import React from 'react';
import MoodPage from './MoodPage.jsx';
import focusedImage from '../../assets/Focused.png';

const Focused = () => {
  return (
    <MoodPage
      moodName="Focused"
      bgColorVar="--color-mood-focused"
      moodImage={focusedImage}
    />
  );
};

export default Focused;