'use client';

import React, { useCallback, useState } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function FileUploader({ onFileSelect, selectedFile }: FileUploaderProps) {
  const t = useTranslations('Upload');
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const validateAndSetFile = useCallback((file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png'];
    if (validTypes.includes(file.type)) {
      onFileSelect(file);
    } else {
      alert('Invalid file format. Please upload PDF, DOCX, TXT, JPG, or PNG.');
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  }, [validateAndSetFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  }, [validateAndSetFile]);

  if (selectedFile) {
    return (
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-border shadow-apple-sm transition-all duration-200 animate-scale-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <File className="h-5 w-5 text-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-xs">
              {selectedFile.name}
            </span>
            <span className="text-xs text-muted">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onFileSelect(null)}
          className="p-2 text-muted hover:text-danger rounded-full hover:bg-danger-light transition-all duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
        isDragActive
          ? 'border-accent bg-accent/5 scale-[1.01]'
          : 'border-border-strong hover:border-accent/40 bg-white/40 hover:bg-accent/5'
      }`}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleChange}
        accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
      />
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
        isDragActive ? 'bg-accent/15 scale-110' : 'bg-accent/10'
      }`}>
        <UploadCloud className={`h-6 w-6 transition-colors duration-300 ${isDragActive ? 'text-accent' : 'text-accent/60'}`} />
      </div>
      <p className="mb-1 text-sm font-semibold text-foreground">
        {t('dropzoneText')}
      </p>
      <p className="text-xs text-muted">
        {t('dropzoneSubText')}
      </p>
    </div>
  );
}
