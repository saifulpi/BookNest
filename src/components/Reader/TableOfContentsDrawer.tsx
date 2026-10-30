import React from 'react';
import { Book, Chapter } from '../../types/book';
import { X, List, CheckCircle2 } from 'lucide-react';

interface TableOfContentsDrawerProps {
  book: Book;
  currentChapterIndex: number;
  onSelectChapter: (chapterIndex: number) => void;
  onClose: () => void;
}

export const TableOfContentsDrawer: React.FC<TableOfContentsDrawerProps> = ({
  book,
  currentChapterIndex,
  onSelectChapter,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm h-full bg-stone-50 dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col text-stone-900 dark:text-stone-100">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <List className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <h3 className="font-semibold text-sm">Table of Contents</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-[200px]">{book.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapters list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {book.chapters.map((chapter: Chapter, idx: number) => {
            const isActive = idx === currentChapterIndex;
            return (
              <button
                key={chapter.id}
                onClick={() => {
                  onSelectChapter(idx);
                  onClose();
                }}
                className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-medium border border-amber-300 dark:border-amber-800'
                    : 'hover:bg-stone-200/60 dark:hover:bg-stone-800/60 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-start gap-3 truncate pr-2">
                  <span className="font-mono text-xs opacity-50 shrink-0 mt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm truncate">{chapter.title}</span>
                </div>
                {isActive && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 flex justify-between items-center">
          <span>{book.chapters.length} Chapters</span>
          <span>{book.format.toUpperCase()} Format</span>
        </div>
      </div>
    </div>
  );
};
