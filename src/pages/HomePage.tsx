import React from 'react';
import Hero from '../components/Hero';
import Upload from '../components/Upload';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import styles from './HomePage.module.css';

interface HomePageProps {
  onUploadComplete: (bitmaps: ImageBitmap[]) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onUploadComplete }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Hero />
        <HowItWorks />
        <Upload onUploadComplete={onUploadComplete} />
      </header>
      <main>
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
