import { CheckCircleIcon, ImageIcon, UploadIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router';
import { MAX_UPLOAD_SIZE, PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS } from '../lib/Constants';

type UploadProps = {
  onComplete?: (base64: string) => void;
};

const Upload = ({ onComplete }: UploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { isSignedIn } = useOutletContext<AuthContext>();

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current !== null) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, []);

  const processFile = (files: FileList | File[]) => {
    if (!isSignedIn) return;
    const first = files[0];
    if (!first) return;
    if (first.size > MAX_UPLOAD_SIZE) {
      setSizeError(`File is too large. Maximum size is ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB.`);
      return;
    }
    setSizeError(null);
    setFile(first);
    setProgress(0);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = Math.min(100, prev + PROGRESS_STEP);
          if (next === 100) {
            if (progressIntervalRef.current !== null) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            setTimeout(() => onComplete?.(base64), REDIRECT_DELAY_MS);
          }
          return next;
        });
      }, PROGRESS_INTERVAL_MS);
    };
    reader.readAsDataURL(first);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) return;
    const files = e.target.files;
    if (files?.length) processFile(files);
    e.target.value = '';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSignedIn) setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!isSignedIn) return;
    const files = e.dataTransfer.files;
    if (files?.length) processFile(files);
  };

  return (
    <div className='upload'>
      {!file ? (
        <div
          className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="drop-input"
            accept=".jpg,.jpeg,.png"
            disabled={!isSignedIn}
            onChange={handleChange}
          />
          <div className="drop-content">
            <div className='drop-icon'>
              <UploadIcon size={20} />
            </div>
            <p>{isSignedIn ? 'Click to upload or drag & drop' : 'Sign in to upload your floor plan'}</p>
            <p className='help'>Max file size: {MAX_UPLOAD_SIZE / (1024 * 1024)}MB</p>
            {sizeError && <p className='help error' role='alert'>{sizeError}</p>}
          </div>
        </div>
      ) : (
        <div className='upload-status'>
            <div className='status-content'>
                <div className='status-icon'>
                    {progress === 100 ? (
                        <CheckCircleIcon className='check' />
                    ) : (
                        <ImageIcon className='image' />
                    )}
                </div>
                <h3>{file.name}</h3>
                <div className='progress'>
                    <div className='bar' style={{ width: `${progress}%` }} />
                
                    <p className='status-text'>
                      {progress < 100 ? 'Analyzing Floor Plan..' : 'Redirecting...'}
                    </p>
               </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default Upload