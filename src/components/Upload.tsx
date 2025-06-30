import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import styles from './Upload.module.css';

// --- PDF.js Configuration ---
const PDF_JS_VERSION = '4.10.38';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDF_JS_VERSION}/build/pdf.worker.mjs`;
const CMAP_URL = `https://unpkg.com/pdfjs-dist@${PDF_JS_VERSION}/cmaps/`;
const STANDARD_FONT_DATA_URL = `https://unpkg.com/pdfjs-dist@${PDF_JS_VERSION}/standard_fonts/`;

// --- Helper Functions ---
async function processPdf(
  file: File,
  onTotalPages: (total: number) => void,
  onProgress: (page: number) => void
) {
  const typedArray = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjsLib.getDocument({
    data: typedArray,
    cMapUrl: CMAP_URL,
    standardFontDataUrl: STANDARD_FONT_DATA_URL,
    cMapPacked: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  onTotalPages(numPages); // Report total pages as soon as we know them

  const imageBitmaps: ImageBitmap[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = new OffscreenCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (context) {
      await page.render({ canvasContext: context as any, viewport }).promise;

      // Invert colors
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let j = 0; j < data.length; j += 4) {
        data[j] = 255 - data[j];
        data[j + 1] = 255 - data[j + 1];
        data[j + 2] = 255 - data[j + 2];
      }
      context.putImageData(imageData, 0, 0);
    }

    imageBitmaps.push(canvas.transferToImageBitmap());
    onProgress(i); // Report progress for the current page
  }

  return { imageBitmaps };
}


// --- Upload Icon Component ---
const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// --- Upload Component ---
interface UploadProps {
  onUploadComplete: (bitmaps: ImageBitmap[]) => void;
}

const Upload: React.FC<UploadProps> = ({ onUploadComplete }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isError, setIsError] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0 || isProcessing) {
        return;
      }

      const file = acceptedFiles[0];
      setIsProcessing(true);
      setIsError(false);
      setProgress(0);
      setTotalPages(null);

      try {
        const { imageBitmaps } = await processPdf(
          file,
          (total) => setTotalPages(total),
          (page) => setProgress(page)
        );
        onUploadComplete(imageBitmaps);
        navigate('/view');
      } catch (error) {
        console.error('Failed to process PDF:', error);
        setIsError(true);
        setTimeout(() => setIsError(false), 1000);
      } finally {
        setIsProcessing(false);
        setProgress(null);
        setTotalPages(null);
      }
    },
    [navigate, onUploadComplete, isProcessing]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 20 * 1024 * 1024,
    disabled: isProcessing,
    onDropRejected: () => {
      setIsError(true);
      setTimeout(() => setIsError(false), 1000);
    },
  });

  const dropzoneClassName = `${styles.dropzone} ${isDragActive ? styles.active : ''} ${isProcessing ? styles.disabled : ''} ${isError ? styles.error : ''}`;

  return (
    <div className={styles.uploadContainer}>
      {isProcessing ? (
        <div className={styles.progressContainer}>
          <div className={styles.spinner}></div>
          <p>Processing PDF...</p>
          {totalPages !== null && (
            <p>{`Page ${progress} of ${totalPages}`}</p>
          )}
        </div>
      ) : (
        <div {...getRootProps()} className={dropzoneClassName}>
          <input {...getInputProps()} />
          <p>
            <UploadIcon />
            {isDragActive ? 'Drop the PDF here...' : 'Drag & Drop PDF or Click to Select'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Upload;
