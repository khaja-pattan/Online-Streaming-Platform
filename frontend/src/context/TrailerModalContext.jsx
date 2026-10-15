import React, { createContext, useContext, useState } from 'react';

const TrailerModalContext = createContext(null);

export const TrailerModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [movie, setMovie] = useState(null);

  const openTrailer = (movieData) => {
    setMovie(movieData);
    setIsOpen(true);
  };

  const closeTrailer = () => {
    setIsOpen(false);
    setMovie(null);
  };

  return (
    <TrailerModalContext.Provider
      value={{
        isOpen,
        movie,
        openTrailer,
        closeTrailer,
      }}
    >
      {children}
    </TrailerModalContext.Provider>
  );
};

export const useTrailerModal = () => {
  const context = useContext(TrailerModalContext);
  if (!context) {
    throw new Error('useTrailerModal must be used within a TrailerModalProvider');
  }
  return context;
};
