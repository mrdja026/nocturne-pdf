import React from 'react';
import styles from './HowItWorks.module.css';

const Step: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <div className={styles.step}>
    <div className={styles.stepNumber}>{number}</div>
    <h3 className={styles.stepTitle}>{title}</h3>
    <p className={styles.stepDescription}>{description}</p>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <section className={styles.howItWorksSection}>
      <div className={styles.stepsContainer}>
        <Step
          number="01"
          title="Select Your PDF"
          description="Use the uploader below or simply drag and drop your file onto the page."
        />
        <Step
          number="02"
          title="Let the Magic Happen"
          description="Our in-browser engine instantly processes your file, applying the night mode theme."
        />
        <Step
          number="03"
          title="Enjoy the View"
          description="Read your PDF in a comfortable, distraction-free environment, with your privacy intact."
        />
      </div>
    </section>
  );
};

export default HowItWorks;
