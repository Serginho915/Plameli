import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  text, 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}) => {
  const buttonClasses = `${styles.button} ${styles[size]} ${className}`;

  return (
    <button className={buttonClasses} {...props}>
      {text || children}
    </button>
  );
};
