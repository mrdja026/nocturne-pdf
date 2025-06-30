import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import styles from './ViewPage.module.css';
import ThumbnailsSidebar from '../components/ThumbnailsSidebar';
import type { TextLayer } from '../types';

interface ViewPageProps {
  imageBitmaps: ImageBitmap[];
  textLayers: TextLayer[][];
}

interface SearchResult {
  pageIndex: number;
  transform: number[];
  width: number;
  height: number;
}

const ViewPage: React.FC<ViewPageProps> = ({ imageBitmaps, textLayers }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [goToPage, setGoToPage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ top: 0, left: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);

  const drawHighlights = useCallback(() => {
    if (containerRef.current) {
      const canvases = Array.from(containerRef.current.querySelectorAll('canvas'));
      canvases.forEach((canvas, pageIndex) => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Redraw the original image first
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.scale(zoomLevel, zoomLevel);
          ctx.drawImage(imageBitmaps[pageIndex], 0, 0);
          ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform

          // Then draw highlights
          searchResults.forEach((result, resultIndex) => {
            if (result.pageIndex === pageIndex) {
              const [, , , , tx, ty] = result.transform;
              const x = tx * zoomLevel;
              const y = ty * zoomLevel;
              const width = result.width * zoomLevel;
              const height = result.height * zoomLevel;

              ctx.fillStyle = resultIndex === currentResultIndex ? 'rgba(255, 255, 0, 0.5)' : 'rgba(0, 100, 255, 0.4)';
              ctx.fillRect(x, y - height, width, height);
            }
          });
        }
      });
    }
  }, [imageBitmaps, searchResults, currentResultIndex, zoomLevel]);

  useEffect(() => {
    if (!imageBitmaps || imageBitmaps.length === 0) {
      navigate('/');
      return;
    }

    const urls = imageBitmaps.map(bitmap => {
      const canvas = document.createElement('canvas');
      const scale = 150 / bitmap.width;
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
      container.innerHTML = '';
      imageBitmaps.forEach((bitmap: ImageBitmap, index: number) => {
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width * zoomLevel;
        canvas.height = bitmap.height * zoomLevel;
        canvas.dataset.pageNumber = `${index + 1}`;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        }
        container.appendChild(canvas);
        observer.observe(canvas);
      });
      drawHighlights();
    }

    return () => observer.disconnect();
  }, [imageBitmaps, navigate, zoomLevel, drawHighlights]);

  useEffect(() => {
    drawHighlights();
  }, [drawHighlights, searchResults, currentResultIndex]);

  const totalPages = imageBitmaps ? imageBitmaps.length : 0;

  const handleBackToHome = () => navigate('/');
  const handleDownloadPdf = () => {
    const pdf = new jsPDF();
    const canvases = containerRef.current?.querySelectorAll('canvas');
    if (canvases) {
      canvases.forEach((canvas, index) => {
        if (index > 0) pdf.addPage();
        const imageData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      });
      pdf.save('download.pdf');
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => prev * 1.2);
  const handleZoomOut = () => setZoomLevel(prev => prev / 1.2);

  const handleGoToPage = (pageNumber: number) => {
    const canvas = containerRef.current?.querySelector(`canvas[data-page-number="${pageNumber}"]`);
    if (canvas) {
      canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleGoToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setGoToPage(e.target.value);
  const handleGoToButtonClick = () => {
    const pageNumber = parseInt(goToPage, 10);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      handleGoToPage(pageNumber);
    }
    setGoToPage('');
  };

  

  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.pageX - containerRef.current.offsetLeft, y: e.pageY - containerRef.current.offsetTop });
      setScrollStart({ top: containerRef.current.scrollTop, left: containerRef.current.scrollLeft });
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);
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

  const handleSearch = () => {
    if (!searchQuery) {
      setSearchResults([]);
      setCurrentResultIndex(-1);
      return;
    }
    const results: SearchResult[] = [];
    textLayers.forEach((pageText, pageIndex) => {
      pageText.forEach(textItem => {
        if (textItem.str.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({
            pageIndex,
            transform: textItem.transform,
            width: textItem.width,
            height: textItem.height,
          });
        }
      });
    });
    setSearchResults(results);
    setCurrentResultIndex(results.length > 0 ? 0 : -1);
    if (results.length > 0) {
      handleGoToPage(results[0].pageIndex + 1);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const navigateToResult = (index: number) => {
    if (index >= 0 && index < searchResults.length) {
      setCurrentResultIndex(index);
      const result = searchResults[index];
      handleGoToPage(result.pageIndex + 1);
    }
  };

  const handleNextResult = () => navigateToResult(currentResultIndex + 1);
  const handlePrevResult = () => navigateToResult(currentResultIndex - 1);

  

  if (!imageBitmaps || totalPages === 0) return null;

  return (
    <div className={styles.viewContainer}>
      <ThumbnailsSidebar thumbnailUrls={thumbnailUrls} onThumbnailClick={handleGoToPage} currentPage={currentPage} />
      <div className={styles.controls}>
        <button onClick={handleBackToHome} className={styles.button}>Convert Another</button>
        <span className={styles.pageInfo}>{currentPage} / {totalPages}</span>
        <button onClick={handleZoomIn} className={styles.button}>Zoom In</button>
        <span className={styles.zoomInfo}> {Math.round(zoomLevel * 100)}% </span>
        <button onClick={handleZoomOut} className={styles.button}>Zoom Out</button>
        <div className={styles.goToPage}>
          <input type="number" value={goToPage} onChange={handleGoToInputChange} placeholder="Page #" className={styles.pageInput} />
          <button onClick={handleGoToButtonClick} className={styles.button}>Go</button>
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search..."
            className={styles.searchInput}
          />
          <button onClick={handleSearch} className={styles.button}>Search</button>
          <button onClick={handlePrevResult} disabled={currentResultIndex <= 0} className={styles.button}>Prev</button>
          <button onClick={handleNextResult} disabled={currentResultIndex >= searchResults.length - 1} className={styles.button}>Next</button>
          {searchResults.length > 0 && (
            <span className={styles.searchResultCount}>
              {currentResultIndex + 1} / {searchResults.length}
            </span>
          )}
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
