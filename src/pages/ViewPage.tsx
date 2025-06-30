import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ViewPage.module.css';

interface ViewPageProps {
  imageBitmaps: ImageBitmap[];
}

const ViewPage: React.FC<ViewPageProps> = ({ imageBitmaps }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = imageBitmaps ? imageBitmaps.length : 0;

  useEffect(() => {
    if (imageBitmaps && Array.isArray(imageBitmaps) && containerRef.current) {
      const container = containerRef.current;
      container.innerHTML = ''; // Clear previous content
      imageBitmaps.forEach((bitmap: ImageBitmap) => {
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(bitmap, 0, 0);
        }
        container.appendChild(canvas);
      });
    }
  }, [imageBitmaps]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleDownloadPdf = () => {
    // Placeholder for PDF download logic
    alert('Download functionality coming soon!');
  };

  if (!imageBitmaps || totalPages === 0) {
    return <div>No PDF processed. Please go back and upload a file.</div>;
  }

  return (
    <div className={styles.viewContainer}>
      <div className={styles.controls}>
        <button onClick={handleBackToHome} className={styles.button}>Back to Home</button>
        <span className={styles.pageInfo}>Total Pages: {totalPages}</span>
        <button onClick={handleDownloadPdf} className={styles.button}>Download PDF</button>
      </div>
      <h1>Processed PDF</h1>
      <div ref={containerRef} className={styles.pdfContainer}></div>
    </div>
  );
};

export default ViewPage;
