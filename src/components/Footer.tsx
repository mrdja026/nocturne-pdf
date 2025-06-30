import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.contentWrapper}>
        <p>
          Crafted with care. A passion project.
        </p>
        <p>
          <a href="https://github.com/Mrdjan/Nocturne-pdf" target="_blank" rel="noopener noreferrer" className={styles.link}>
            View Source on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
