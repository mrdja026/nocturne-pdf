import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import styles from './ViewPage.module.css';
import ThumbnailsSidebar from '../components/ThumbnailsSidebar';

interface ViewPageProps {
  imageBitmaps: ImageBitmap[];
}

const ViewPage: React.FC<ViewPageProps> = ({ imageBitmaps }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [goToPage, setGoToPage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ top: 0, left: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([]);
  let hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!imageBitmaps || imageBitmaps.length === 0) {
      navigate('/');
      return;
    }

    // Generate thumbnail URLs once
    const urls = imageBitmaps.map(bitmap => {
      const canvas = document.createElement('canvas');
      const scale = 150 / bitmap.width; // Scale to a 150px width
      canvas.width = 150;
      canvas.height = bitmap.height * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      }
      return canvas.toDataURL();
    });
    setThumbnailUrls(urls);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = entry.target.getAttribute('data-page-number');
            if (pageNum) {
              setCurrentPage(parseInt(pageNum, 10));
            }
          }
        });
      },
      { root: containerRef.current, threshold: 0.5 }
    );

    if (containerRef.current) {
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
        observer.observe(canvas);
      });
    }

    return () => observer.disconnect();
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

  const handleGoToPage = (pageNumber: number) => {
    const canvas = containerRef.current?.querySelector(`canvas[data-page-number="${pageNumber}"]`);
    if (canvas) {
      canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleGoToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoToPage(e.target.value);
  };

  const handleGoToButtonClick = () => {
    const pageNumber = parseInt(goToPage, 10);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      handleGoToPage(pageNumber);
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.pageX - containerRef.current.offsetLeft, y: e.pageY - containerRef.current.offsetTop });
      setScrollStart({ top: containerRef.current.scrollTop, left: containerRef.current.scrollLeft });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = (x - dragStart.x) * 2;
    const walkY = (y - dragStart.y) * 2;
    containerRef.current.scrollLeft = scrollStart.left - walkX;
    containerRef.current.scrollTop = scrollStart.top - walkY;
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
      <ThumbnailsSidebar thumbnailUrls={thumbnailUrls} onThumbnailClick={handleGoToPage} currentPage={currentPage} />
      <div className={`${styles.controls} ${controlsVisible ? '' : styles.hidden}`}>
        <button onClick={handleBackToHome} className={styles.button}>Convert Another</button>
        <span className={styles.pageInfo}>{currentPage} / {totalPages}</span>
        <button onClick={handleZoomIn} className={styles.button}>Zoom In</button>
        <span className={styles.zoomInfo}> {Math.round(zoomLevel * 100)}% </span>
        <button onClick={handleZoomOut} className={styles.button}>Zoom Out</button>
        <div className={styles.goToPage}>
          <input
            type="number"
            value={goToPage}
            onChange={handleGoToInputChange}
            placeholder="Page #"
            className={styles.pageInput}
          />
          <button onClick={handleGoToButtonClick} className={styles.button}>Go</button>
        </div>
        <button onClick={handleDownloadPdf} className={styles.button}>Download PDF</button>
      </div>
      <div
        ref={containerRef}
        className={`${styles.pdfContainer} ${isDragging ? styles.dragging : ''}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleDragMove}
      >
        {/* Canvases are appended here by useEffect */}
      </div>
    </div>
  );
};

export default ViewPage;
