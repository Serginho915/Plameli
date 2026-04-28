import React from 'react';
import styles from './Burger.module.scss';

interface BurgerProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export const Burger: React.FC<BurgerProps> = ({ isOpen, onClick, className = '' }) => {
  return (
    <button 
      className={`${styles.burger} ${isOpen ? styles.open : ''} ${className}`} 
      onClick={onClick}
      aria-label="Menu"
    >
      <span className={styles.line}></span>
      <span className={styles.line}></span>
    </button>
  );
};
