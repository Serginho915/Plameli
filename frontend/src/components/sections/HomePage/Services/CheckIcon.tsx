import React from "react";
import styles from "./Services.module.scss";

export const CheckIcon = () => {
  return (
    <div className={styles.checkIconWrapper}>
      <svg
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.00015 5.54751L4.23092 11.0001L11.0002 1.00012"
          stroke="#516378"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
