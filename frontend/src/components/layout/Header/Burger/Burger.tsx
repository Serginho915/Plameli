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
      aria-label={isOpen ? "Close Menu" : "Open Menu"}
    >
      <div className={styles.iconWrapper}>
        {isOpen ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={styles.closeIcon}>
            <path d="M11 1L1 11" stroke="#404E5E" strokeWidth="2" strokeLinecap="round"/>
            <path d="M1 1L11 11" stroke="#404E5E" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <>
            <span className={styles.line}></span>
            <span className={styles.line}></span>
          </>
        )}
      </div>
    </button>
  );
};
