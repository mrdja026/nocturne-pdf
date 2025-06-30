import React from 'react';
import styles from './Features.module.css';

const Feature: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className={styles.feature}>
    <h3 className={styles.featureTitle}>{title}</h3>
    <p className={styles.featureDescription}>{description}</p>
  </div>
);

const Features: React.FC = () => {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.contentWrapper}>
        <div className={styles.featuresGrid}>
          <Feature
            title="Absolute Privacy"
            description="Your documents never leave your device. All processing happens securely in your browser, guaranteeing your data remains 100% private."
          />
          <Feature
            title="Instant, Intelligent Conversion"
            description="From glaring light to soothing dark in seconds. Our smart engine preserves layouts and images while transforming text for a seamless reading experience."
          />
          <Feature
            title="Zero Friction"
            description="No sign-ups, no ads, no nonsense. Just drag, drop, and immerse yourself in your document. It's that simple."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
