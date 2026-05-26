"use client";

import React from "react";
import Image from "next/image";
import styles from "./EducationProgram.module.scss";

export interface ProgramModule {
  title: string;
  description: string;
}

interface EducationProgramProps {
  program: ProgramModule[];
  title: string;
}

export const EducationProgram: React.FC<EducationProgramProps> = ({ program, title }) => {
  if (!program || program.length === 0) return null;

  return (
    <div className={styles.programCard}>
      <h2 className={styles.programTitle}>{title}</h2>
      
      <ul className={styles.programList}>
        {program.map((module, idx) => (
          <li key={idx} className={styles.programItem}>
            <div className={styles.itemHeader}>
              <div className={styles.iconWrapper}>
                <Image
                  src="/images/Stats/service.svg"
                  alt="Module"
                  width={22}
                  height={22}
                />
              </div>
              <h3 className={styles.itemTitle}>{module.title}</h3>
            </div>
            
            <div className={styles.itemBody}>
              <p className={styles.itemDesc}>{module.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
