import React from 'react';
import styles from './Hero.module.css';

const Hero: React.FC = () => {
  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>Tired of Blinding White PDFs at 2 AM?</h1>
      <p className={styles.subtitle}>
        Nocturne PDF transforms documents into a private, comfortable night mode
        experience, right in your browser.
        <br />
        No uploads. No tracking. No accounts.
      </p>
    </div>
  );
};

export default Hero;
