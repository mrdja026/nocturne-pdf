import React, { useEffect, useRef } from 'react';
import styles from './ThumbnailsSidebar.module.css';

interface ThumbnailsSidebarProps {
  thumbnailUrls: string[];
  onThumbnailClick: (pageNumber: number) => void;
  currentPage: number;
}

const ThumbnailsSidebar: React.FC<ThumbnailsSidebarProps> = ({ thumbnailUrls, onThumbnailClick, currentPage }) => {
  const activeThumbnailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeThumbnailRef.current) {
      activeThumbnailRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentPage]);

  return (
    <div className={styles.sidebar}>
      {thumbnailUrls.map((dataUrl, index) => {
        const pageNum = index + 1;
        const isActive = pageNum === currentPage;
        const thumbnailClass = `${styles.thumbnail} ${isActive ? styles.active : ''}`;

        return (
          <div
            key={index}
            ref={isActive ? activeThumbnailRef : null}
            className={thumbnailClass}
            onClick={() => onThumbnailClick(pageNum)}
          >
            <img src={dataUrl} alt={`Page ${pageNum}`} />
            <span>{pageNum}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ThumbnailsSidebar;
