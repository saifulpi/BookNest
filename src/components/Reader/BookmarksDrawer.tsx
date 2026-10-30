import React, { useState } from 'react';
import { Bookmark, Highlight } from '../../types/book';
import { Bookmark as BookmarkIcon, Highlighter, Trash2, X, Plus, Calendar, FileText } from 'lucide-react';

interface BookmarksDrawerProps {
  bookmarks: Bookmark[];
  highlights: Highlight[];
  currentPage: number;
  currentChapterTitle: string;
  onAddBookmark: () => void;
  onDeleteBookmark: (id: string) => void;
  onDeleteHighlight: (id: string) => void;
  onJumpToPage: (page: number) => void;
  onClose: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  bookmarks,
  highlights,
  currentPage,
  currentChapterTitle,
  onAddBookmark,
  onDeleteBookmark,
  onDeleteHighlight,
  onJumpToPage,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'highlights'>('bookmarks');

  // Check if current page is already bookmarked
  const isCurrentPageBookmarked = bookmarks.some((b) => b.page === currentPage);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm h-full bg-stone-50 dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col text-stone-900 dark:text-stone-100">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-semibold text-sm">Bookmarks & Notes</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pt-3 pb-2 flex gap-1 border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-800/40">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'bookmarks'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookmarkIcon className="w-3.5 h-3.5" />
            <span>Bookmarks ({bookmarks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'highlights'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notes ({highlights.length})</span>
          </button>
        </div>

        {/* Quick Add Bookmark Action */}
        {activeTab === 'bookmarks' && (
          <div className="p-3 bg-stone-100 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <span className="text-xs text-stone-600 dark:text-stone-400">
              Current: <strong className="font-mono">Page {currentPage}</strong>
            </span>
            <button
              onClick={onAddBookmark}
              disabled={isCurrentPageBookmarked}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                isCurrentPageBookmarked
                  ? 'bg-stone-200 dark:bg-stone-700 text-stone-400 cursor-not-allowed'
                  : 'bg-amber-600 text-white hover:bg-amber-700 shadow-xs'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCurrentPageBookmarked ? 'Bookmarked' : 'Bookmark Page'}</span>
            </button>
          </div>
        )}

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'bookmarks' ? (
            bookmarks.length === 0 ? (
              <div className="text-center py-12 px-4 text-stone-400 dark:text-stone-500">
                <BookmarkIcon className="w-10 h-10 mx-auto mb-2 opacity-30 stroke-[1.5]" />
                <p className="text-sm font-medium text-stone-600 dark:text-stone-400">No bookmarks yet</p>
                <p className="text-xs mt-1">Bookmark important pages to quickly jump back to them anytime.</p>
              </div>
            ) : (
              bookmarks.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80 shadow-xs hover:border-amber-400 dark:hover:border-amber-600 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 font-mono">
                      Page {b.page}
                    </span>
                    <button
                      onClick={() => onDeleteBookmark(b.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-500 rounded transition-all"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-medium truncate mb-1">
                    {b.chapterTitle}
                  </p>
                  {b.snippet && (
                    <p className="text-xs text-stone-600 dark:text-stone-300 italic line-clamp-2">
                      "{b.snippet}"
                    </p>
                  )}
                  <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        onJumpToPage(b.page);
                        onClose();
                      }}
                      className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      Jump to page →
                    </button>
                  </div>
                </div>
              ))
            )
          ) : highlights.length === 0 ? (
            <div className="text-center py-12 px-4 text-stone-400 dark:text-stone-500">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-30 stroke-[1.5]" />
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">No highlights or notes</p>
              <p className="text-xs mt-1">Select text while reading to add colorful highlights and personal annotations.</p>
            </div>
          ) : (
            highlights.map((h) => {
              const colorClass = {
                amber: 'border-l-amber-400 bg-amber-50/60 dark:bg-amber-950/20',
                emerald: 'border-l-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20',
                rose: 'border-l-rose-400 bg-rose-50/60 dark:bg-rose-950/20',
                sky: 'border-l-sky-400 bg-sky-50/60 dark:bg-sky-950/20'
              }[h.color];

              return (
                <div
                  key={h.id}
                  className={`p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 ${colorClass} border-l-4 shadow-xs group`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold font-mono text-stone-600 dark:text-stone-400">
                      Page {h.page}
                    </span>
                    <button
                      onClick={() => onDeleteHighlight(h.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-500 rounded transition-all"
                      title="Remove highlight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-stone-800 dark:text-stone-200 font-serif italic mb-2 line-clamp-3">
                    "{h.text}"
                  </p>
                  {h.note && (
                    <div className="p-2 bg-white/70 dark:bg-stone-800/70 rounded-lg border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 mb-2">
                      <span className="font-semibold block text-[10px] text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-0.5">
                        Note:
                      </span>
                      {h.note}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-stone-400 text-[10px]">
                      {new Date(h.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        onJumpToPage(h.page);
                        onClose();
                      }}
                      className="font-medium text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      Jump to passage →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
