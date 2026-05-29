'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  toggleMenu: () => void;
  isBookingModalOpen: boolean;
  openBookingModal: () => void;
  closeBookingModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

let globalIsMenuOpen = false;

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(globalIsMenuOpen);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleSetIsMenuOpen = (isOpen: boolean) => {
    globalIsMenuOpen = isOpen;
    setIsMenuOpen(isOpen);
  };

  const toggleMenu = () => handleSetIsMenuOpen(!isMenuOpen);

  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => setIsBookingModalOpen(false);

  return (
    <UIContext.Provider value={{
      isMenuOpen,
      setIsMenuOpen: handleSetIsMenuOpen,
      toggleMenu,
      isBookingModalOpen,
      openBookingModal,
      closeBookingModal,
    }}>
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
