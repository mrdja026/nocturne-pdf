import React from 'react';
import styles from './Hero.module.css';

interface HeroProps {
  theme: string;
}

const Hero: React.FC<HeroProps> = ({ theme }) => {
  return (
    <div className={styles.hero}>
      <h1 className={`${styles.title} ${styles.animated}`}>Tired of Blinding White PDFs at 2 AM?</h1>
      <p className={`${styles.subtitle} ${styles.animated}`}>
        Nocturne PDF transforms documents into a private, comfortable night mode
        experience, right in your browser.
        <br />
        No uploads. No tracking. No accounts.
      </p>
      {theme === 'light' && (
        <p className={styles.funnyText}>You see how it hurts?</p>
      )}
    </div>
  );
};

export default Hero;
