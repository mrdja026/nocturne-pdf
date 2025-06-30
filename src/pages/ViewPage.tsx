import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import styles from './ViewPage.module.css';

interface ViewPageProps {
  imageBitmaps: ImageBitmap[];
}

const ViewPage: React.FC<ViewPageProps> = ({ imageBitmaps }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [goToPage, setGoToPage] = useState('');
  let hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!imageBitmaps || imageBitmaps.length === 0) {
      navigate('/');
    } else if (containerRef.current) {
      const container = containerRef.current;
      container.innerHTML = ''; // Clear previous content
      imageBitmaps.forEach((bitmap: ImageBitmap, index: number) => {
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width * zoomLevel;
        canvas.height = bitmap.height * zoomLevel;
        canvas.dataset.pageNumber = `${index + 1}`;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(zoomLevel, zoomLevel);
          ctx.drawImage(bitmap, 0, 0);
        }
        container.appendChild(canvas);
      });
    }
  }, [imageBitmaps, navigate, zoomLevel]);

  const totalPages = imageBitmaps ? imageBitmaps.length : 0;

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleDownloadPdf = () => {
    const pdf = new jsPDF();
    const canvases = containerRef.current?.querySelectorAll('canvas');
    if (canvases) {
      canvases.forEach((canvas, index) => {
        if (index > 0) {
          pdf.addPage();
        }
        const imageData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      });
      pdf.save('download.pdf');
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => prev * 1.2);
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => prev / 1.2);
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(goToPage, 10);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      const canvas = containerRef.current?.querySelector(`canvas[data-page-number="${pageNumber}"]`);
      if (canvas) {
        canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setGoToPage('');
  };

  const handleMouseMove = () => {
    setControlsVisible(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    hideControlsTimeout.current = setTimeout(() => {
      setControlsVisible(false);
    }, 2000);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, []);

  if (!imageBitmaps || totalPages === 0) {
    return null;
  }

  return (
    <div className={styles.viewContainer}>
      <div className={`${styles.controls} ${controlsVisible ? '' : styles.hidden}`}>
        <button onClick={handleBackToHome} className={styles.button}>Convert Another</button>
        <span className={styles.pageInfo}>Total Pages: {totalPages}</span>
        <button onClick={handleZoomIn} className={styles.button}>Zoom In</button>
        <span className={styles.zoomInfo}> {Math.round(zoomLevel * 100)}% </span>
        <button onClick={handleZoomOut} className={styles.button}>Zoom Out</button>
        <div className={styles.goToPage}>
          <input
            type="number"
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            placeholder="Page #"
            className={styles.pageInput}
          />
          <button onClick={handleGoToPage} className={styles.button}>Go</button>
        </div>
        <button onClick={handleDownloadPdf} className={styles.button}>Download PDF</button>
      </div>
      <h1>Processed PDF</h1>
      <div ref={containerRef} className={styles.pdfContainer}></div>
    </div>
  );
};

export default ViewPage;
