import React, { useState, useEffect } from 'react';
import { Book, Bookmark, Highlight } from '../types/book';
import { dbService } from '../services/db';
import { Bookmark as BookmarkIcon, FileText, Trash2, ArrowUpRight, BookOpen } from 'lucide-react';

interface BookmarksViewProps {
  books: Book[];
  onOpenBookAtPage: (book: Book, page: number) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({ books, onOpenBookAtPage }) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'highlights'>('bookmarks');
  const [allBookmarks, setAllBookmarks] = useState<(Bookmark & { book?: Book })[]>([]);
  const [allHighlights, setAllHighlights] = useState<(Highlight & { book?: Book })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const bms: (Bookmark & { book?: Book })[] = [];
      const hls: (Highlight & { book?: Book })[] = [];

      for (const book of books) {
        const bookBms = await dbService.getBookmarks(book.id);
        bookBms.forEach((b) => bms.push({ ...b, book }));

        const bookHls = await dbService.getHighlights(book.id);
        bookHls.forEach((h) => hls.push({ ...h, book }));
      }

      bms.sort((a, b) => b.createdAt - a.createdAt);
      hls.sort((a, b) => b.createdAt - a.createdAt);

      setAllBookmarks(bms);
      setAllHighlights(hls);
      setLoading(false);
    }

    loadData();
  }, [books]);

  const handleDeleteBookmark = async (id: string) => {
    await dbService.deleteBookmark(id);
    setAllBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleDeleteHighlight = async (id: string) => {
    await dbService.deleteHighlight(id);
    setAllHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold">
            Saved Passages
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
            Bookmarks & Marginalia
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Your personal treasury of marked pages, highlighted quotations, and margin notes.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-stone-200/70 dark:bg-stone-800 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'bookmarks'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <BookmarkIcon className="w-3.5 h-3.5 text-amber-600" />
            <span>Bookmarks ({allBookmarks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'highlights'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Notes & Quotes ({allHighlights.length})</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === 'bookmarks' ? (
          allBookmarks.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-8">
              <BookmarkIcon className="w-10 h-10 mx-auto mb-2 text-stone-300 dark:text-stone-600" />
              <p className="text-base font-serif font-medium text-stone-700 dark:text-stone-300">
                No bookmarks saved yet
              </p>
              <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                While reading any book in your library, click the ribbon bookmark button on the reading toolbar to save your favorite passages.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allBookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 hover:border-amber-400 dark:hover:border-amber-600 transition-all shadow-xs flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold font-mono text-amber-700 dark:text-amber-400">
                        {bm.book?.title} · Page {bm.page}
                      </span>
                      <button
                        onClick={() => handleDeleteBookmark(bm.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-500 rounded transition-opacity"
                        title="Delete bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1">
                      {bm.chapterTitle}
                    </h4>

                    {bm.snippet && (
                      <p className="text-xs text-stone-600 dark:text-stone-300 font-serif italic line-clamp-3 leading-relaxed">
                        "{bm.snippet}"
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">
                      Saved {new Date(bm.createdAt).toLocaleDateString()}
                    </span>
                    {bm.book && (
                      <button
                        onClick={() => onOpenBookAtPage(bm.book!, bm.page)}
                        className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <span>Open at Page {bm.page}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : allHighlights.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-8">
            <FileText className="w-10 h-10 mx-auto mb-2 text-stone-300 dark:text-stone-600" />
            <p className="text-base font-serif font-medium text-stone-700 dark:text-stone-300">
              No notes or highlights yet
            </p>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Highlight text directly on the page while reading to save memorable quotes and attach personal thoughts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allHighlights.map((hl) => {
              const colorBorder = {
                amber: 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
                emerald: 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20',
                rose: 'border-l-rose-500 bg-rose-50/50 dark:bg-rose-950/20',
                sky: 'border-l-sky-500 bg-sky-50/50 dark:bg-sky-950/20'
              }[hl.color];

              return (
                <div
                  key={hl.id}
                  className={`p-5 rounded-2xl border border-stone-200 dark:border-stone-800 border-l-4 ${colorBorder} shadow-xs flex flex-col justify-between group`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold font-mono text-stone-600 dark:text-stone-300">
                        {hl.book?.title} · Page {hl.page}
                      </span>
                      <button
                        onClick={() => handleDeleteHighlight(hl.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-500 rounded transition-opacity"
                        title="Delete highlight"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-sm font-serif italic text-stone-800 dark:text-stone-100 leading-relaxed mb-3">
                      "{hl.text}"
                    </p>

                    {hl.note && (
                      <div className="p-3 bg-white/80 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300">
                        <span className="font-semibold block text-[10px] text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                          Personal Note:
                        </span>
                        {hl.note}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">
                      {new Date(hl.createdAt).toLocaleDateString()}
                    </span>
                    {hl.book && (
                      <button
                        onClick={() => onOpenBookAtPage(hl.book!, hl.page)}
                        className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <span>Jump to page</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
