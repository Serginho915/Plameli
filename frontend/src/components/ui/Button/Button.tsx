import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'consultationMobile';
  children?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  text, 
  size = 'md', 
  variant = 'default',
  children, 
  className = '', 
  ...props 
}) => {
  const buttonClasses = `
    ${styles.button} 
    ${styles[size]} 
    ${variant !== 'default' ? styles[variant] : ''} 
    ${className}
  `.trim();

  return (
    <button className={buttonClasses} {...props}>
      {text || children}
    </button>
  );
};
