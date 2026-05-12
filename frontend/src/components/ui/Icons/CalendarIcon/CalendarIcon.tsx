import React from "react";

interface CalendarIconProps {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
}

export const CalendarIcon: React.FC<CalendarIconProps> = ({ 
  className, 
  color = "currentColor", 
  width = 20, 
  height = 20 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M6.66669 1.66699V5.00033" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.3333 1.66699V5.00033" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.8333 3.33301H4.16667C3.24619 3.33301 2.5 4.0792 2.5 4.99967V16.6663C2.5 17.5868 3.24619 18.333 4.16667 18.333H15.8333C16.7538 18.333 17.5 17.5868 17.5 16.6663V4.99967C17.5 4.0792 16.7538 3.33301 15.8333 3.33301Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.5 8.33301H17.5" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.5 13.3337L9.16667 15.0003L12.5 11.667" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};
