import React, { useState, useMemo } from 'react';
import { Book, BookPage } from '../../types/book';
import { Search, X, ChevronRight, BookOpen } from 'lucide-react';

interface InBookSearchModalProps {
  book: Book;
  pages: BookPage[];
  onJumpToPage: (page: number) => void;
  onClose: () => void;
}

export const InBookSearchModal: React.FC<InBookSearchModalProps> = ({
  book,
  pages,
  onJumpToPage,
  onClose
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return [];

    const q = query.toLowerCase();
    const results: { page: number; chapterTitle: string; snippet: string }[] = [];

    pages.forEach((page) => {
      const cleanContent = page.content.replace(/<[^>]+>/g, ' ');
      const lower = cleanContent.toLowerCase();
      const matchIndex = lower.indexOf(q);

      if (matchIndex !== -1) {
        const start = Math.max(0, matchIndex - 60);
        const end = Math.min(cleanContent.length, matchIndex + q.length + 80);
        const snippet = (start > 0 ? '...' : '') + cleanContent.substring(start, end).trim() + (end < cleanContent.length ? '...' : '');

        results.push({
          page: page.pageNumber,
          chapterTitle: page.chapterTitle,
          snippet
        });
      }
    });

    return results.slice(0, 30); // limit to top 30 matches
  }, [query, pages]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-stone-900 dark:text-stone-100 max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3 bg-white dark:bg-stone-850">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search within "${book.title}"...`}
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-stone-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results stats */}
        <div className="px-4 py-2 bg-stone-100/70 dark:bg-stone-800/40 text-xs text-stone-500 border-b border-stone-200 dark:border-stone-800 flex justify-between">
          <span>{query.trim().length >= 2 ? `${searchResults.length} occurrences found` : 'Type 2+ characters to search'}</span>
          <span className="font-mono text-[11px]">{book.chapters.length} chapters indexed</span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {query.trim().length >= 2 && searchResults.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No matches found for "{query}"</p>
              <p className="text-xs mt-1">Try another keyword or phrase.</p>
            </div>
          ) : (
            searchResults.map((res, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onJumpToPage(res.page);
                  onClose();
                }}
                className="w-full text-left p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600 bg-white dark:bg-stone-800/60 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-all flex items-center justify-between group"
              >
                <div className="pr-3 flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold font-mono text-amber-700 dark:text-amber-400">
                      Page {res.page}
                    </span>
                    <span className="text-xs text-stone-500 truncate max-w-[200px]">
                      {res.chapterTitle}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 font-serif leading-relaxed line-clamp-2">
                    {res.snippet}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
