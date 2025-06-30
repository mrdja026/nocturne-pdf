import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import styles from './Upload.module.css';

// A simple SVG icon for upload
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

interface UploadProps {
  onUploadComplete: (bitmaps: ImageBitmap[]) => void;
}

const Upload: React.FC<UploadProps> = ({ onUploadComplete }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);


  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log('onDrop triggered.');
      console.log('Accepted files count:', acceptedFiles.length);
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        console.log('File accepted:', file.name);

        try {
          console.log('Attempting to create worker...');
          const worker = new Worker(new URL('../worker/pdf.worker.ts', import.meta.url), {
            type: 'module',
          });
          console.log('Worker created successfully.');

          worker.onmessage = (e) => {
            if (!e.data) {
              console.error('Received empty message from worker. This might indicate an unhandled error inside the worker.');
              return;
            }
            console.log('Message from worker:', e.data);
            const { type, page, total, imageBitmaps, message } = e.data;
            if (type === 'total_pages') {
              setTotalPages(total);
            } else if (type === 'progress') {
              setProgress(page);
            } else if (type === 'complete') {
              onUploadComplete(imageBitmaps);
              navigate('/view');
              worker.terminate();
            } else if (type === 'error') {
              console.error('Error message from worker:', message);
              alert(message);
              worker.terminate();
            }
          };

          worker.onerror = (error) => {
            console.error('Worker error event:', error);
            if (error instanceof ErrorEvent && error.message) {
              console.error('Worker error message:', error.message);
              alert(`An error occurred in the PDF processing worker: ${error.message}`);
            } else {
              alert('An unknown error occurred in the PDF processing worker.');
            }
            worker.terminate();
          };

          console.log('Posting message to worker...');
          worker.postMessage({ file });
          console.log('Message posted to worker.');

        } catch (error) {
          console.error('Failed to create or communicate with worker:', error);
          alert('A critical error occurred with the processing engine.');
        }
      } else {
        console.log('No files were accepted by react-dropzone.');
      }
    },
    [navigate, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    onDropRejected: (fileRejections) => {
      console.log('onDropRejected triggered with rejections:', fileRejections);
      if (fileRejections.length > 0 && fileRejections[0].errors.length > 0) {
        const error = fileRejections[0].errors[0];
        console.log('Rejection error code:', error.code);
        console.log('Rejection error message:', error.message);
        if (error.code === 'file-too-large') {
          alert('File is larger than 20MB');
        } else if (error.code === 'file-invalid-type') {
          alert('Please upload a PDF file.');
        } else {
          alert('An unknown error occurred during file upload.');
        }
      } else {
        alert('File upload rejected for an unknown reason.');
      }
    },
  });

  

  const dropzoneClassName = isDragActive
    ? `${styles.dropzone} ${styles.active}`
    : styles.dropzone;

  return (
    <div className={styles.uploadContainer}>
      {progress !== null && totalPages !== null ? (
        <div className={styles.progressContainer}>
          <p>Processing PDF...</p>
          <progress value={progress} max={totalPages} className={styles.progressBar} />
          <p>{`Page ${progress} of ${totalPages}`}</p>
        </div>
      ) : (
        <div {...getRootProps()} className={dropzoneClassName}>
          <input {...getInputProps()} />
          <p>
            <UploadIcon />
            {isDragActive
              ? 'Drop the PDF here...'
              : "Drag & Drop PDF or Click to Select"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Upload;
