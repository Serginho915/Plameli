import React from 'react'
import styles from './SectionTitle.module.scss'

export const SectionTitle = ({ text, className }: { text: string; className?: string }) => {
  return (
    <h3 className={`${styles.sectionTitle} ${className || ''}`}>{text}</h3>
  )
}
