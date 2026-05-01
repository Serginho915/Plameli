import React from "react";
import { ArrowUpRightIcon } from "../ArrowUpRightIcon";
import styles from "./CircleArrowIcon.module.scss";

interface CircleArrowIconProps {
  className?: string;
  isParentHovered?: boolean;
}

export const CircleArrowIcon: React.FC<CircleArrowIconProps> = ({ 
  className = "", 
  isParentHovered = false 
}) => {
  return (
    <span className={`${styles.circleIcon} ${isParentHovered ? styles.active : ""} ${className}`}>
      <ArrowUpRightIcon />
    </span>
  );
};
