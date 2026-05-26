'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  toggleMenu: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

let globalIsMenuOpen = false;

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(globalIsMenuOpen);

  const handleSetIsMenuOpen = (isOpen: boolean) => {
    globalIsMenuOpen = isOpen;
    setIsMenuOpen(isOpen);
  };

  const toggleMenu = () => handleSetIsMenuOpen(!isMenuOpen);

  return (
    <UIContext.Provider value={{ isMenuOpen, setIsMenuOpen: handleSetIsMenuOpen, toggleMenu }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
