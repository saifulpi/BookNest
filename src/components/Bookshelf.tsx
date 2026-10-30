import React, { useState, useMemo } from 'react';
import { Book, Collection, UserSettings } from '../types/book';
import { BookCard } from './BookCard';
import {
  BookOpen,
  Search,
  Plus,
  Compass,
  Clock,
  Sparkles,
  Bookmark,
  Award,
  SlidersHorizontal,
  ChevronRight,
  Flame,
  LayoutGrid,
  Library
} from 'lucide-react';

interface BookshelfProps {
  books: Book[];
  collections: Collection[];
  settings: UserSettings;
  onOpenBook: (book: Book) => void;
  onOpenImport: () => void;
  onToggleFavorite: (book: Book) => void;
  onToggleComplete: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onAssignCollection: (bookId: string, colId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const Bookshelf: React.FC<BookshelfProps> = ({
  books,
  collections,
  settings,
  onOpenBook,
  onOpenImport,
  onToggleFavorite,
  onToggleComplete,
  onDeleteBook,
  onAssignCollection,
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'lastRead' | 'title' | 'author' | 'added' | 'progress'>('lastRead');
  const [viewMode, setViewMode] = useState<'shelf' | 'grid'>('shelf');

  // Daily literary quotes
  const quotes = [
    { text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin" },
    { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
    { text: "I have always imagined that Paradise will be a kind of library.", author: "Jorge Luis Borges" },
    { text: "Books are a uniquely portable magic.", author: "Stephen King" }
  ];
  const todayQuote = quotes[new Date().getDate() % quotes.length];

  // Recently read books (in progress)
  const continueReadingBooks = useMemo(() => {
    return books
      .filter((b) => (b.currentPage || 1) > 1 && !b.isCompleted)
      .sort((a, b) => b.lastReadAt - a.lastReadAt)
      .slice(0, 4);
  }, [books]);

  // Filtered & sorted books
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.genre.toLowerCase().includes(q)
      );
    }

    // Collection filter
    if (selectedCollectionId === 'completed') {
      result = result.filter((b) => b.isCompleted);
    } else if (selectedCollectionId === 'favorites') {
      result = result.filter((b) => b.collectionId === 'favorites');
    } else if (selectedCollectionId !== 'all') {
      result = result.filter((b) => b.collectionId === selectedCollectionId);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'author') return a.author.localeCompare(b.author);
      if (sortBy === 'added') return b.addedAt - a.addedAt;
      if (sortBy === 'progress') {
        const progA = a.currentPage / Math.max(1, a.totalPages);
        const progB = b.currentPage / Math.max(1, b.totalPages);
        return progB - progA;
      }
      return b.lastReadAt - a.lastReadAt;
    });

    return result;
  }, [books, searchQuery, selectedCollectionId, sortBy]);

  // Chunk books into shelves of 4-6 items for realistic bookshelf rendering
  const shelfRows = useMemo(() => {
    const rows: Book[][] = [];
    const itemsPerRow = 5;
    for (let i = 0; i < filteredBooks.length; i += itemsPerRow) {
      rows.push(filteredBooks.slice(i, i + itemsPerRow));
    }
    return rows;
  }, [filteredBooks]);

  // Calculate summary stats
  const totalMinutesRead = Math.round(books.reduce((acc, b) => acc + (b.readingTimeSeconds || 0), 0) / 60);
  const completedCount = books.filter((b) => b.isCompleted).length;

  return (
    <div className="min-h-screen pb-20">
      {/* 1. Hero / Welcome Section */}
      <section className="relative px-4 sm:px-8 pt-8 pb-10 border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold">
                Personal Digital Library
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1 tracking-tight text-balance">
                Welcome back to your Study
              </h1>
              <blockquote className="mt-3 text-sm text-stone-600 dark:text-stone-400 font-serif italic border-l-2 border-amber-600/60 pl-3">
                "{todayQuote.text}"
                <cite className="block text-xs not-italic font-sans text-stone-500 mt-1">
                  — {todayQuote.author}
                </cite>
              </blockquote>
            </div>

            {/* Quick reading summary counters */}
            <div className="flex items-center gap-6 p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 shadow-xs shrink-0">
              <div className="text-center">
                <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                  {books.length}
                </span>
                <span className="block text-[11px] text-stone-500 uppercase tracking-wider font-medium">
                  Volumes
                </span>
              </div>
              <div className="w-[1px] h-8 bg-stone-200 dark:bg-stone-700" />
              <div className="text-center">
                <span className="text-2xl font-serif font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                  {totalMinutesRead}m
                </span>
                <span className="block text-[11px] text-stone-500 uppercase tracking-wider font-medium">
                  Read Time
                </span>
              </div>
              <div className="w-[1px] h-8 bg-stone-200 dark:bg-stone-700" />
              <div className="text-center">
                <span className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {completedCount}
                </span>
                <span className="block text-[11px] text-stone-500 uppercase tracking-wider font-medium">
                  Finished
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Continue Reading Shelf (If there are active books) */}
      {continueReadingBooks.length > 0 && (
        <section className="px-4 sm:px-8 py-8 border-b border-stone-200 dark:border-stone-800">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100">
                  Continue Reading
                </h2>
              </div>
              <span className="text-xs text-stone-500">Pick up right where you left off</span>
            </div>

            {/* Shelf Container with Realistic Wood Base */}
            <div className="relative pt-4 pb-8">
              <div className="flex items-end gap-6 sm:gap-10 overflow-x-auto pb-6 px-4">
                {continueReadingBooks.map((book) => {
                  const progressPct = Math.round(
                    ((book.currentPage || 1) / Math.max(1, book.totalPages)) * 100
                  );
                  return (
                    <div key={book.id} className="shrink-0 flex flex-col items-center">
                      <BookCard
                        book={book}
                        collections={collections}
                        onOpen={onOpenBook}
                        onToggleFavorite={onToggleFavorite}
                        onToggleComplete={onToggleComplete}
                        onDelete={onDeleteBook}
                        onAssignCollection={onAssignCollection}
                      />
                      <button
                        onClick={() => onOpenBook(book)}
                        className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <span>Resume (Pg {book.currentPage})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Wooden Shelf Plank */}
              <div className="w-full h-4 shelf-wood dark:shelf-wood-dark rounded-xs shadow-md" />
            </div>
          </div>
        </section>
      )}

      {/* 3. My Library / Main Shelves */}
      <section className="px-4 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Controls Bar: Search, Collections Filter & Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, or genre..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter by Collections & Sort & View Mode */}
            <div className="flex items-center flex-wrap gap-2.5">
              {/* Collection Select */}
              <select
                value={selectedCollectionId}
                onChange={(e) => setSelectedCollectionId(e.target.value)}
                className="text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="all">All Volumes ({books.length})</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="lastRead">Recently Opened</option>
                <option value="title">Title (A–Z)</option>
                <option value="author">Author</option>
                <option value="added">Recently Added</option>
                <option value="progress">Reading Progress</option>
              </select>

              {/* View Mode Toggle: Shelf vs Grid */}
              <div className="flex p-0.5 bg-stone-200/70 dark:bg-stone-800 rounded-xl">
                <button
                  onClick={() => setViewMode('shelf')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'shelf'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                  title="Bookshelf View"
                >
                  <Library className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                  title="Grid Catalog View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Import CTA */}
              <button
                onClick={onOpenImport}
                className="px-3.5 py-2 text-xs font-medium text-white bg-amber-700 hover:bg-amber-800 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Import Book</span>
              </button>
            </div>
          </div>

          {/* Render Bookshelves or Grid */}
          {filteredBooks.length === 0 ? (
            <div className="py-20 text-center rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 p-8">
              <Library className="w-12 h-12 mx-auto mb-3 text-stone-300 dark:text-stone-600" />
              <h3 className="text-base font-serif font-semibold text-stone-800 dark:text-stone-200">
                No books found on this shelf
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? `No titles or authors matching "${searchQuery}". Try clearing search.`
                  : 'Import your own EPUB, PDF, or TXT books, or explore other collections.'}
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-3 py-1.5 text-xs font-medium bg-stone-200 dark:bg-stone-800 rounded-lg hover:bg-stone-300"
                  >
                    Clear Filter
                  </button>
                )}
                <button
                  onClick={onOpenImport}
                  className="px-4 py-2 text-xs font-medium bg-amber-700 text-white rounded-lg hover:bg-amber-800 flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Import a Book</span>
                </button>
              </div>
            </div>
          ) : viewMode === 'shelf' ? (
            /* Multi-Shelf Layout with Wooden Planks */
            <div className="space-y-12">
              {shelfRows.map((row, rowIdx) => (
                <div key={rowIdx} className="relative pt-4">
                  {/* Books on the shelf */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6 gap-x-4 sm:gap-x-6 items-end justify-items-center px-2 sm:px-6">
                    {row.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        collections={collections}
                        onOpen={onOpenBook}
                        onToggleFavorite={onToggleFavorite}
                        onToggleComplete={onToggleComplete}
                        onDelete={onDeleteBook}
                        onAssignCollection={onAssignCollection}
                      />
                    ))}
                  </div>

                  {/* Realistic Wooden Shelf Ledge Plank */}
                  <div className="w-full h-4 shelf-wood dark:shelf-wood-dark rounded-xs shadow-md mt-1" />
                </div>
              ))}
            </div>
          ) : (
            /* Grid Catalog View */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  collections={collections}
                  onOpen={onOpenBook}
                  onToggleFavorite={onToggleFavorite}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDeleteBook}
                  onAssignCollection={onAssignCollection}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
