// src/hooks/useFavorites.js

import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'moodMatchFavorites';

const useFavorites = () => {
  // Initialize state from localStorage, or default to an empty array
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading favorites from localStorage:", error);
      return [];
    }
  });

  // Effect to update localStorage whenever the 'favorites' state changes
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error writing favorites to localStorage:", error);
    }
  }, [favorites]);

  // Function to check if a mood is currently favorited
  const isFavorite = (moodName) => {
    return favorites.includes(moodName);
  };

  // Function to add or remove a mood from favorites
  const toggleFavorite = (moodName) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(moodName)) {
        // Remove from favorites
        return prevFavorites.filter(mood => mood !== moodName);
      } else {
        // Add to favorites
        return [...prevFavorites, moodName];
      }
    });
  };

  // Expose the necessary functions and state checkers
  return {
    isFavorite,
    toggleFavorite,
    favorites // You can use this to list favorites on the History/Profile page
  };
};

export { useFavorites };