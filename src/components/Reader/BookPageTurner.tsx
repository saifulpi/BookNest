import React, { useState, useEffect, useRef } from 'react';
import { Book, BookPage, UserSettings, Highlight } from '../../types/book';
import { PdfPageRenderer } from './PdfPageRenderer';
import { playPageTurnSound } from '../../utils/sound';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookPageTurnerProps {
  book: Book;
  pages: BookPage[];
  currentPage: number; // 1-indexed
  onPageChange: (newPage: number) => void;
  settings: UserSettings;
  highlights: Highlight[];
  onAddHighlight: (text: string, color: Highlight['color'], note?: string) => void;
  onOpenToc: () => void;
}

export const BookPageTurner: React.FC<BookPageTurnerProps> = ({
  book,
  pages,
  currentPage,
  onPageChange,
  settings,
  highlights,
  onAddHighlight,
  onOpenToc
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionPos, setSelectionPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Check if dual page is active (desktop and user enabled)
  const isDualPage = settings.twoPageSpread && typeof window !== 'undefined' && window.innerWidth >= 1024 && book.format !== 'pdf';

  // Current left & right page numbers
  // In dual page, current page aligns to odd numbers (1 & 2, 3 & 4)
  const leftPageNum = isDualPage ? (currentPage % 2 === 1 ? currentPage : currentPage - 1) : currentPage;
  const rightPageNum = isDualPage ? leftPageNum + 1 : null;

  const leftPage = pages.find((p) => p.pageNumber === leftPageNum);
  const rightPage = rightPageNum ? pages.find((p) => p.pageNumber === rightPageNum) : null;

  // Handle forward navigation
  const goNext = () => {
    if (isFlipping) return;
    const step = isDualPage ? 2 : 1;
    const target = currentPage + step;
    if (target <= pages.length + (isDualPage ? 1 : 0)) {
      if (settings.soundEnabled) playPageTurnSound();
      if (settings.pageTurnMode === 'flip') {
        setIsFlipping(true);
        setFlipDirection('next');
        setTimeout(() => {
          onPageChange(Math.min(target, pages.length));
          setIsFlipping(false);
          setFlipDirection(null);
        }, 420);
      } else {
        onPageChange(Math.min(target, pages.length));
      }
    }
  };

  // Handle backward navigation
  const goPrev = () => {
    if (isFlipping) return;
    const step = isDualPage ? 2 : 1;
    const target = currentPage - step;
    if (target >= 1) {
      if (settings.soundEnabled) playPageTurnSound();
      if (settings.pageTurnMode === 'flip') {
        setIsFlipping(true);
        setFlipDirection('prev');
        setTimeout(() => {
          onPageChange(Math.max(1, target));
          setIsFlipping(false);
          setFlipDirection(null);
        }, 420);
      } else {
        onPageChange(Math.max(1, target));
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isDualPage, isFlipping, pages.length]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Minimum swipe threshold 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goNext(); // Swiped left -> next
      } else {
        goPrev(); // Swiped right -> prev
      }
    }
    setTouchStartX(null);
  };

  // Text selection handler for highlighting
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 2) {
      const text = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setSelectionPos({
        x: Math.min(window.innerWidth - 180, Math.max(20, rect.left + rect.width / 2 - 90)),
        y: Math.max(10, rect.top - 54)
      });
    } else {
      setSelectedText('');
      setSelectionPos(null);
    }
  };

  // Reading typography classes
  const fontClass = {
    serif: 'font-[family-name:var(--font-serif)]',
    display: 'font-[family-name:var(--font-display)]',
    sans: 'font-[family-name:var(--font-sans)]',
    mono: 'font-[family-name:var(--font-mono)]'
  }[settings.fontFamily];

  const lineHeightClass = {
    compact: 'leading-relaxed',
    normal: 'leading-[1.8]',
    relaxed: 'leading-[2.1]'
  }[settings.lineSpacing];

  const textAlignClass = settings.textAlign === 'justify' ? 'text-justify' : 'text-left';

  const widthStyle = {
    narrow: 'max-w-xl',
    medium: 'max-w-2xl',
    wide: 'max-w-4xl'
  }[settings.readingWidth];

  // Render individual page content
  const renderPageContent = (page: BookPage | null | undefined, isRight = false) => {
    if (!page) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-40 italic select-none">
          <span>End of Volume</span>
        </div>
      );
    }

    if (page.type === 'pdf-canvas') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center overflow-auto p-2">
          <PdfPageRenderer fileData={book.fileData} pageNumber={page.pageNumber} theme={settings.defaultTheme} />
        </div>
      );
    }

    // Filter highlights for this page
    const pageHighlights = highlights.filter(h => h.page === page.pageNumber);

    return (
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden select-text">
        {/* Header: Book title or Chapter Title */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/5 dark:border-white/5 text-xs uppercase tracking-widest opacity-50 select-none">
          <span className="truncate max-w-[200px]">{page.chapterTitle}</span>
          <span className="font-mono tabular-nums">{page.pageNumber}</span>
        </div>

        {/* Main Body Text */}
        <div
          className={`flex-1 overflow-hidden ${fontClass} ${lineHeightClass} ${textAlignClass} ${
            settings.dropCaps ? 'first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none' : ''
          }`}
          style={{ fontSize: `${settings.fontSize}px` }}
        >
          {page.content.split(/\n\n+/).map((para, idx) => (
            <p key={idx} className="mb-5 last:mb-0">
              {para}
            </p>
          ))}
        </div>

        {/* Footer: Chapter progress */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-black/5 dark:border-white/5 text-[11px] opacity-40 select-none">
          <span className="truncate">{book.title}</span>
          <span className="font-mono">{Math.round((page.pageNumber / pages.length) * 100)}%</span>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-full flex items-center justify-center py-4 px-2 sm:px-6 book-perspective select-none transition-colors duration-300 ${
        settings.defaultTheme === 'light' ? 'theme-light' :
        settings.defaultTheme === 'sepia' ? 'theme-sepia' :
        settings.defaultTheme === 'night' ? 'theme-night' : 'theme-dark'
      }`}
    >
      {/* Floating Highlight / Note bubble on text selection */}
      {selectedText && selectionPos && (
        <div
          className="fixed z-50 flex items-center gap-1.5 p-1.5 bg-stone-900/95 text-white rounded-lg shadow-xl backdrop-blur-md border border-stone-700 animate-in fade-in zoom-in-95 duration-150"
          style={{ left: `${selectionPos.x}px`, top: `${selectionPos.y}px` }}
        >
          <button
            onClick={() => {
              onAddHighlight(selectedText, 'amber');
              setSelectedText('');
              setSelectionPos(null);
            }}
            className="w-5 h-5 rounded-full bg-amber-400 hover:scale-110 transition-transform"
            title="Highlight Yellow"
          />
          <button
            onClick={() => {
              onAddHighlight(selectedText, 'emerald');
              setSelectedText('');
              setSelectionPos(null);
            }}
            className="w-5 h-5 rounded-full bg-emerald-400 hover:scale-110 transition-transform"
            title="Highlight Green"
          />
          <button
            onClick={() => {
              onAddHighlight(selectedText, 'rose');
              setSelectedText('');
              setSelectionPos(null);
            }}
            className="w-5 h-5 rounded-full bg-rose-400 hover:scale-110 transition-transform"
            title="Highlight Pink"
          />
          <button
            onClick={() => {
              onAddHighlight(selectedText, 'sky');
              setSelectedText('');
              setSelectionPos(null);
            }}
            className="w-5 h-5 rounded-full bg-sky-400 hover:scale-110 transition-transform"
            title="Highlight Blue"
          />
          <div className="w-[1px] h-4 bg-stone-700 mx-1" />
          <button
            onClick={() => {
              const note = window.prompt('Add a personal note to this passage:', '');
              if (note !== null) {
                onAddHighlight(selectedText, 'amber', note);
              }
              setSelectedText('');
              setSelectionPos(null);
            }}
            className="px-2 py-0.5 text-xs text-stone-200 hover:text-white hover:bg-stone-800 rounded transition-colors whitespace-nowrap"
          >
            Add Note
          </button>
        </div>
      )}

      {/* Navigation Margin Click Zones with Subtle Chevrons */}
      <button
        onClick={goPrev}
        disabled={currentPage <= 1 || isFlipping}
        aria-label="Previous page"
        className={`group absolute left-2 sm:left-4 z-30 p-2 sm:p-3 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 ${
          currentPage <= 1 ? 'opacity-0 pointer-events-none' : 'opacity-60 hover:opacity-100'
        }`}
      >
        <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
      </button>

      <button
        onClick={goNext}
        disabled={currentPage >= pages.length || isFlipping}
        aria-label="Next page"
        className={`group absolute right-2 sm:right-4 z-30 p-2 sm:p-3 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 ${
          currentPage >= pages.length ? 'opacity-0 pointer-events-none' : 'opacity-60 hover:opacity-100'
        }`}
      >
        <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
      </button>

      {/* Main Book Surface Container */}
      <div
        className={`w-full h-full max-h-[88vh] flex items-stretch rounded-xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10 ${widthStyle} ${
          settings.defaultTheme === 'light' ? 'bg-[#fcfbf9]' :
          settings.defaultTheme === 'sepia' ? 'bg-[#f5ede0]' :
          settings.defaultTheme === 'night' ? 'bg-[#212631]' : 'bg-[#111317]'
        } ${
          settings.pageTurnMode === 'slide' ? 'transition-transform duration-300 ease-out' :
          settings.pageTurnMode === 'fade' ? 'transition-opacity duration-200' : ''
        }`}
        style={{
          boxShadow: settings.defaultTheme === 'dark' || settings.defaultTheme === 'night'
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 25px 50px -12px rgba(80, 50, 20, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Left Page (or Single Page) */}
        <div
          className={`relative flex-1 flex flex-col h-full ${
            isDualPage ? 'border-r border-black/10 dark:border-white/10 spine-shadow-right' : ''
          }`}
        >
          {renderPageContent(leftPage, false)}
        </div>

        {/* Middle Spine Divider (Visible in Dual Page Spread) */}
        {isDualPage && (
          <div className="w-[2px] h-full bg-black/15 dark:bg-white/10 relative z-10 spine-center-crease shadow-inner" />
        )}

        {/* Right Page (Only in Dual Page Spread) */}
        {isDualPage && (
          <div className="relative flex-1 flex flex-col h-full spine-shadow-left">
            {renderPageContent(rightPage, true)}
          </div>
        )}

        {/* 3D Realistic Flipping Page Overlay (Active during flip) */}
        {settings.pageTurnMode === 'flip' && isFlipping && (
          <div
            className={`absolute top-0 bottom-0 z-20 pointer-events-none preserve-3d transition-transform duration-400 ease-in-out ${
              isDualPage
                ? flipDirection === 'next'
                  ? 'right-0 w-1/2 origin-left shadow-2xl'
                  : 'left-0 w-1/2 origin-right shadow-2xl'
                : 'left-0 w-full origin-left shadow-2xl'
            } ${
              settings.defaultTheme === 'light' ? 'bg-[#fcfbf9]' :
              settings.defaultTheme === 'sepia' ? 'bg-[#f5ede0]' :
              settings.defaultTheme === 'night' ? 'bg-[#212631]' : 'bg-[#111317]'
            }`}
            style={{
              transform: flipDirection === 'next' ? 'rotateY(-180deg)' : 'rotateY(0deg)',
              animation: flipDirection === 'next'
                ? 'flipForward 420ms cubic-bezier(0.25, 1, 0.5, 1) forwards'
                : 'flipBackward 420ms cubic-bezier(0.25, 1, 0.5, 1) forwards'
            }}
          >
            {/* Dynamic Paper Lighting/Shadow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10 pointer-events-none" />
            <div className="h-full flex flex-col p-8 opacity-80">
              <div className="text-xs uppercase tracking-widest opacity-40 font-mono">Turning...</div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes flipForward {
          0% {
            transform: rotateY(0deg);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
          50% {
            transform: rotateY(-90deg) scale(1.02);
            box-shadow: 0 25px 40px rgba(0,0,0,0.3);
          }
          100% {
            transform: rotateY(-180deg);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
        }
        @keyframes flipBackward {
          0% {
            transform: rotateY(-180deg);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
          50% {
            transform: rotateY(-90deg) scale(1.02);
            box-shadow: 0 25px 40px rgba(0,0,0,0.3);
          }
          100% {
            transform: rotateY(0deg);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
        }
      `}</style>
    </div>
  );
};
