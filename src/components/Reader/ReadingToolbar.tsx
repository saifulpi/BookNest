import React, { useState, useEffect } from 'react';
import { Book, UserSettings } from '../../types/book';
import {
  ArrowLeft,
  List,
  Bookmark as BookmarkIcon,
  Search,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Clock
} from 'lucide-react';

interface ReadingToolbarProps {
  book: Book;
  currentPage: number;
  totalPages: number;
  currentChapterTitle: string;
  isBookmarked: boolean;
  settings: UserSettings;
  isFullscreen: boolean;
  onBack: () => void;
  onPageChange: (page: number) => void;
  onToggleToc: () => void;
  onToggleBookmarks: () => void;
  onToggleSettings: () => void;
  onToggleSearch: () => void;
  onToggleFullscreen: () => void;
  onQuickThemeToggle: () => void;
}

export const ReadingToolbar: React.FC<ReadingToolbarProps> = ({
  book,
  currentPage,
  totalPages,
  currentChapterTitle,
  isBookmarked,
  settings,
  isFullscreen,
  onBack,
  onPageChange,
  onToggleToc,
  onToggleBookmarks,
  onToggleSettings,
  onToggleSearch,
  onToggleFullscreen,
  onQuickThemeToggle
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [sliderVal, setSliderVal] = useState(currentPage);

  useEffect(() => {
    setSliderVal(currentPage);
  }, [currentPage]);

  // Auto-hide toolbar after 4 seconds of inactivity if not hovering toolbar
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleActivity = () => {
      setIsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 4500);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    timeout = setTimeout(() => setIsVisible(false), 4500);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      clearTimeout(timeout);
    };
  }, []);

  const progressPct = Math.round((currentPage / Math.max(1, totalPages)) * 100);
  const estMinutesRemaining = Math.max(1, Math.round(((totalPages - currentPage) * 1.5)));

  return (
    <>
      {/* Top Floating Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 px-4 py-3 transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2 rounded-2xl bg-stone-900/85 dark:bg-stone-900/90 text-stone-200 backdrop-blur-md shadow-xl border border-stone-800/80">
          {/* Left Zone: Back + Book Title */}
          <div className="flex items-center gap-3 truncate pr-2">
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-colors shrink-0"
              title="Return to Bookshelf"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="truncate">
              <h2 className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {book.title}
              </h2>
              <p className="text-[11px] text-stone-400 truncate hidden sm:block">
                {currentChapterTitle}
              </p>
            </div>
          </div>

          {/* Right Zone: Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={onToggleSearch}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
              title="Search Book (Ctrl+F)"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleToc}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
              title="Table of Contents"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleBookmarks}
              className={`p-2 rounded-xl transition-colors ${
                isBookmarked
                  ? 'text-amber-400 bg-amber-950/40'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
              title="Bookmarks & Highlights"
            >
              <BookmarkIcon className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onQuickThemeToggle}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors hidden sm:flex"
              title="Cycle Theme"
            >
              {settings.defaultTheme === 'light' || settings.defaultTheme === 'sepia' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onToggleSettings}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
              title="Reading Appearance & Typography"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleFullscreen}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors hidden md:flex"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Floating Scrubber Bar */}
      <footer
        className={`fixed bottom-0 left-0 right-0 z-40 px-4 py-3 transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-2xl mx-auto px-5 py-3 rounded-2xl bg-stone-900/90 dark:bg-stone-900/95 text-stone-200 backdrop-blur-md shadow-xl border border-stone-800/80">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span className="truncate max-w-[200px] font-medium text-stone-300">
              {currentChapterTitle}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px] text-stone-400">
                <Clock className="w-3 h-3 text-stone-500" />
                ~{estMinutesRemaining}m left
              </span>
              <span className="font-mono tabular-nums text-stone-300">
                {currentPage} / {totalPages} ({progressPct}%)
              </span>
            </div>
          </div>

          {/* Interactive Progress Slider */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded text-stone-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <input
              type="range"
              min="1"
              max={totalPages}
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              onMouseUp={() => onPageChange(sliderVal)}
              onTouchEnd={() => onPageChange(sliderVal)}
              className="flex-1 accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
            />

            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded text-stone-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};
