import React, { createContext, useContext, useState } from 'react';

// 1. Create the Context object
const PlaybackContext = createContext();

// 2. Create the custom hook for easy consumption
// eslint-disable-next-line react-refresh/only-export-components
export const usePlayback = () => {
    return useContext(PlaybackContext);
};

// 3. Create the Provider component
export const PlaybackProvider = ({ children }) => {
    const [currentUri, setCurrentUri] = useState(null);

    // Function to set the URI and trigger playback
    const playTrack = (uri) => {
        setCurrentUri(uri);
    };

    const value = {
        currentUri,
        playTrack,
        // You could add controls like pause, next, etc., here if using the SDK
    };

    return (
        <PlaybackContext.Provider value={value}>
            {children}
        </PlaybackContext.Provider>
    );
};