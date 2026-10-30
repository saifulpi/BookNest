import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Book, Bookmark, Highlight, UserSettings, BookPage } from '../../types/book';
import { dbService } from '../../services/db';
import { paginateBook } from '../../utils/paginator';
import { BookPageTurner } from './BookPageTurner';
import { ReadingToolbar } from './ReadingToolbar';
import { TableOfContentsDrawer } from './TableOfContentsDrawer';
import { BookmarksDrawer } from './BookmarksDrawer';
import { ReadingSettingsModal } from './ReadingSettingsModal';
import { InBookSearchModal } from './InBookSearchModal';
import { CompletionCelebrationModal } from './CompletionCelebrationModal';

interface ReaderViewProps {
  book: Book;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onBack: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  book,
  settings,
  onUpdateSettings,
  onBack
}) => {
  const [currentPage, setCurrentPage] = useState<number>(book.currentPage || 1);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showToc, setShowToc] = useState<boolean>(false);
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showCompletion, setShowCompletion] = useState<boolean>(false);

  // Accumulate reading session seconds
  const sessionSecondsRef = useRef<number>(0);

  // Generate pages for this book
  const pages: BookPage[] = useMemo(() => {
    return paginateBook(book);
  }, [book]);

  const totalPages = pages.length;

  // Load bookmarks & highlights from IndexedDB
  useEffect(() => {
    dbService.getBookmarks(book.id).then(setBookmarks);
    dbService.getHighlights(book.id).then(setHighlights);
  }, [book.id]);

  // Track reading time interval
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        sessionSecondsRef.current += 5;
        // Save to DB every 30 seconds
        if (sessionSecondsRef.current % 30 === 0) {
          dbService.addReadingTime(book.id, 30);
        }
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      if (sessionSecondsRef.current % 30 !== 0) {
        dbService.addReadingTime(book.id, sessionSecondsRef.current % 30);
      }
    };
  }, [book.id]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Save reading progress when page changes
  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    const isFinished = newPage >= totalPages;
    await dbService.updateReadingProgress(book.id, newPage, totalPages, isFinished);

    if (isFinished && !showCompletion && !book.isCompleted) {
      setShowCompletion(true);
    }
  };

  // Current page object and chapter
  const currentPageObj = pages.find((p) => p.pageNumber === currentPage) || pages[0];
  const currentChapterTitle = currentPageObj ? currentPageObj.chapterTitle : book.chapters[0]?.title || 'Chapter 1';
  const currentChapterIndex = currentPageObj ? currentPageObj.chapterIndex : 0;

  // Jump to chapter from Table of Contents
  const handleSelectChapter = (chapterIndex: number) => {
    const targetPage = pages.find((p) => p.chapterIndex === chapterIndex);
    if (targetPage) {
      handlePageChange(targetPage.pageNumber);
    }
  };

  // Add Bookmark
  const handleAddBookmark = async () => {
    const snippet = currentPageObj ? currentPageObj.content.replace(/<[^>]+>/g, ' ').slice(0, 120) : '';
    const newBm: Bookmark = {
      id: `bm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookId: book.id,
      page: currentPage,
      chapterTitle: currentChapterTitle,
      snippet,
      createdAt: Date.now()
    };
    await dbService.saveBookmark(newBm);
    setBookmarks((prev) => [newBm, ...prev]);
  };

  // Delete Bookmark
  const handleDeleteBookmark = async (id: string) => {
    await dbService.deleteBookmark(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // Add Highlight & Note
  const handleAddHighlight = async (text: string, color: Highlight['color'], note?: string) => {
    const newHl: Highlight = {
      id: `hl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookId: book.id,
      page: currentPage,
      chapterIndex: currentChapterIndex,
      text,
      color,
      note,
      createdAt: Date.now()
    };
    await dbService.saveHighlight(newHl);
    setHighlights((prev) => [newHl, ...prev]);
  };

  // Delete Highlight
  const handleDeleteHighlight = async (id: string) => {
    await dbService.deleteHighlight(id);
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Cycle Theme
  const handleQuickThemeToggle = () => {
    const themeCycle: UserSettings['defaultTheme'][] = ['sepia', 'light', 'night', 'dark'];
    const nextIdx = (themeCycle.indexOf(settings.defaultTheme) + 1) % themeCycle.length;
    onUpdateSettings({ defaultTheme: themeCycle[nextIdx] });
  };

  const isCurrentBookmarked = bookmarks.some((b) => b.page === currentPage);
  const totalReadingMinutes = Math.round((book.readingTimeSeconds + sessionSecondsRef.current) / 60);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-stone-900 select-none overflow-hidden">
      {/* Floating Minimal Toolbar */}
      <ReadingToolbar
        book={book}
        currentPage={currentPage}
        totalPages={totalPages}
        currentChapterTitle={currentChapterTitle}
        isBookmarked={isCurrentBookmarked}
        settings={settings}
        isFullscreen={isFullscreen}
        onBack={onBack}
        onPageChange={handlePageChange}
        onToggleToc={() => setShowToc((v) => !v)}
        onToggleBookmarks={() => setShowBookmarks((v) => !v)}
        onToggleSettings={() => setShowSettings((v) => !v)}
        onToggleSearch={() => setShowSearch((v) => !v)}
        onToggleFullscreen={handleToggleFullscreen}
        onQuickThemeToggle={handleQuickThemeToggle}
      />

      {/* Main Page Turner Area */}
      <main className="flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        <BookPageTurner
          book={book}
          pages={pages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          settings={settings}
          highlights={highlights}
          onAddHighlight={handleAddHighlight}
          onOpenToc={() => setShowToc(true)}
        />
      </main>

      {/* Table of Contents Drawer */}
      {showToc && (
        <TableOfContentsDrawer
          book={book}
          currentChapterIndex={currentChapterIndex}
          onSelectChapter={handleSelectChapter}
          onClose={() => setShowToc(false)}
        />
      )}

      {/* Bookmarks & Notes Drawer */}
      {showBookmarks && (
        <BookmarksDrawer
          bookmarks={bookmarks}
          highlights={highlights}
          currentPage={currentPage}
          currentChapterTitle={currentChapterTitle}
          onAddBookmark={handleAddBookmark}
          onDeleteBookmark={handleDeleteBookmark}
          onDeleteHighlight={handleDeleteHighlight}
          onJumpToPage={(p) => handlePageChange(p)}
          onClose={() => setShowBookmarks(false)}
        />
      )}

      {/* Reading Appearance Settings Modal */}
      {showSettings && (
        <ReadingSettingsModal
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* In-Book Search Modal */}
      {showSearch && (
        <InBookSearchModal
          book={book}
          pages={pages}
          onJumpToPage={(p) => handlePageChange(p)}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Celebration Modal upon finishing book */}
      {showCompletion && (
        <CompletionCelebrationModal
          book={book}
          totalReadingMinutes={totalReadingMinutes}
          onRestartBook={() => {
            handlePageChange(1);
            setShowCompletion(false);
          }}
          onReturnToLibrary={() => {
            setShowCompletion(false);
            onBack();
          }}
          onClose={() => setShowCompletion(false)}
        />
      )}
    </div>
  );
};
