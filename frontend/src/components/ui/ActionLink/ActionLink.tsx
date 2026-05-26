import React, { useState } from "react";
import Link from "next/link";
import { CircleArrowIcon } from "@/components/ui/Icons/CircleArrowIcon/CircleArrowIcon";
import styles from "./ActionLink.module.scss";

interface ActionLinkProps {
  href?: string;
  text: string;
  className?: string;
  variant?: "forbes" | "outline";
  hideTextOnMobile?: boolean;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

export const ActionLink: React.FC<ActionLinkProps> = ({ 
  href, 
  text, 
  className = "", 
  variant = "outline",
  hideTextOnMobile = false,
  onClick,
  target,
  rel
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <>
      <span className={styles.text}>{text}</span>
      <CircleArrowIcon className={styles.icon} isParentHovered={isHovered} />
    </>
  );

  const combinedClassName = `${styles.actionLink} ${styles[variant]} ${hideTextOnMobile ? styles.hideTextOnMobile : ""} ${className}`;

  if (href) {
    return (
      <Link 
        href={href} 
        className={combinedClassName}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        target={target}
        rel={rel}
      >
        {content}
      </Link>
    );
  }

  return (
    <div 
      className={combinedClassName} 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
    >
      {content}
    </div>
  );
};
