import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

interface PdfPageRendererProps {
  fileData?: ArrayBuffer | string;
  pageNumber: number;
  theme: 'light' | 'sepia' | 'night' | 'dark';
}

export const PdfPageRenderer: React.FC<PdfPageRendererProps> = ({ fileData, pageNumber, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function renderPage() {
      if (!fileData) {
        setError('No PDF file data provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Load document
        const loadingTask = pdfjsLib.getDocument({
          data: fileData instanceof ArrayBuffer ? fileData : new TextEncoder().encode(fileData)
        });
        const pdfDoc = await loadingTask.promise;

        if (isCancelled) return;
        if (pageNumber > pdfDoc.numPages || pageNumber < 1) {
          setError(`Invalid page ${pageNumber}`);
          setLoading(false);
          return;
        }

        const page = await pdfDoc.getPage(pageNumber);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Support high-DPI screens
        const pixelRatio = window.devicePixelRatio || 1;
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const targetWidth = Math.min(window.innerWidth > 900 ? 560 : window.innerWidth - 60, 680);
        const scale = (targetWidth / unscaledViewport.width) * 1.5;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width * pixelRatio;
        canvas.height = viewport.height * pixelRatio;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };

        await page.render(renderContext).promise;
        if (!isCancelled) setLoading(false);
      } catch (err: any) {
        if (!isCancelled) {
          console.error('PDF render error:', err);
          setError(err.message || 'Failed to render PDF page.');
          setLoading(false);
        }
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [fileData, pageNumber]);

  return (
    <div className={`flex flex-col items-center justify-center min-h-[460px] p-2 relative ${
      theme === 'dark' ? 'filter invert hue-rotate-180 contrast-90 brightness-95' :
      theme === 'sepia' ? 'filter sepia-[0.35] contrast-95' :
      theme === 'night' ? 'filter invert hue-rotate-180 brightness-85 contrast-90' : ''
    }`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100/50 dark:bg-stone-900/50">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {error ? (
        <div className="text-center p-8 text-stone-500">
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <canvas ref={canvasRef} className="max-w-full h-auto shadow-md rounded" />
      )}
    </div>
  );
};
