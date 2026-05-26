import React from "react";
import styles from "./CheckIcon.module.scss";

interface CheckIconProps {
  className?: string;
  pure?: boolean;
}

export const CheckIcon: React.FC<CheckIconProps> = ({ className, pure = false }) => {
  return (
    <div className={`${!pure ? styles.checkIconWrapper : ""} ${className || ""}`}>
      <svg
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.00015 5.54751L4.23092 11.0001L11.0002 1.00012"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
