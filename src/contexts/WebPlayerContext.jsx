/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

// Create context
const WebPlayerContext = createContext();

// Custom hook
export function useWebPlayer() {
  const context = useContext(WebPlayerContext);
  
  if (context === undefined) {
    throw new Error('useWebPlayer must be used within a WebPlayerProvider');
  }
  
  return context;
}

// Provider component
export function WebPlayerProvider({ children }) {
  const [deviceId, setDeviceId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const value = {
    deviceId,
    setDeviceId,
    isReady,
    setIsReady
  };

  return (
    <WebPlayerContext.Provider value={value}>
      {children}
    </WebPlayerContext.Provider>
  );
}