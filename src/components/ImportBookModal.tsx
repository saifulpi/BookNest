import React, { useState, useRef } from 'react';
import { parseTxtFile, parseEpubFile, parsePdfFile } from '../services/fileParser';
import { Book } from '../types/book';
import { UploadCloud, FileText, BookOpen, AlertCircle, CheckCircle, X, Sparkles } from 'lucide-react';

interface ImportBookModalProps {
  onBookImported: (book: Book) => void;
  onClose: () => void;
}

export const ImportBookModal: React.FC<ImportBookModalProps> = ({ onBookImported, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleProcessFile = async (file: File) => {
    setErrorMessage(null);
    setIsProcessing(true);
    const ext = file.name.split('.').pop()?.toLowerCase();

    try {
      let importedBook: Book;

      if (ext === 'epub') {
        setStatusMessage('Extracting EPUB chapters, manifest, and cover...');
        importedBook = await parseEpubFile(file);
      } else if (ext === 'pdf') {
        setStatusMessage('Parsing PDF pages and generating high-res thumbnail...');
        importedBook = await parsePdfFile(file);
      } else if (ext === 'txt' || ext === 'md') {
        setStatusMessage('Formatting text and detecting chapter sections...');
        importedBook = await parseTxtFile(file);
      } else {
        throw new Error(`Unsupported file type: .${ext}. Please upload EPUB, PDF, TXT, or MD files.`);
      }

      setStatusMessage('Saving to your personal digital library...');
      setTimeout(() => {
        onBookImported(importedBook);
        setIsProcessing(false);
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('Import error:', err);
      setErrorMessage(err.message || 'Failed to parse file.');
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 text-stone-900 dark:text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Import Book to Library</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">Add EPUB, PDF, or TXT documents to your shelf</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropzone */}
        <div className="mt-5">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 scale-[1.01]'
                : 'border-stone-300 dark:border-stone-700 hover:border-amber-500 bg-white dark:bg-stone-800/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".epub,.pdf,.txt,.md"
              onChange={handleFileChange}
              className="hidden"
            />

            {isProcessing ? (
              <div className="py-6 flex flex-col items-center">
                <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{statusMessage}</p>
                <p className="text-xs text-stone-400 mt-1">Processing locally with browser storage</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-stone-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 shadow-xs">
                  <BookOpen className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  Click to browse or drag & drop your book here
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 max-w-xs">
                  Supports <strong className="text-stone-700 dark:text-stone-300">.epub</strong>, <strong className="text-stone-700 dark:text-stone-300">.pdf</strong>, and <strong className="text-stone-700 dark:text-stone-300">.txt</strong> formats
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-stone-400 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Automatic cover generation & local offline storage</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Format guide */}
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div className="p-2.5 rounded-xl bg-stone-100/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block font-mono">EPUB</span>
            <span className="text-[11px] text-stone-500">Reflowable chapters</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-100/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block font-mono">PDF</span>
            <span className="text-[11px] text-stone-500">High-DPI pages</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-100/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block font-mono">TXT / MD</span>
            <span className="text-[11px] text-stone-500">Fast clean reading</span>
          </div>
        </div>
      </div>
    </div>
  );
};
