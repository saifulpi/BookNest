import React, { useState } from 'react';
import { Book, Collection } from '../types/book';
import { BookOpen, MoreVertical, Trash2, Heart, FolderPlus, CheckCircle2 } from 'lucide-react';

interface BookCardProps {
  book: Book;
  collections: Collection[];
  onOpen: (book: Book) => void;
  onToggleFavorite: (book: Book) => void;
  onToggleComplete: (book: Book) => void;
  onDelete: (id: string) => void;
  onAssignCollection: (bookId: string, collectionId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  collections,
  onOpen,
  onToggleFavorite,
  onToggleComplete,
  onDelete,
  onAssignCollection
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [imgError, setImgError] = useState(false);

  const progress = Math.min(100, Math.round(((book.currentPage || 1) / Math.max(1, book.totalPages)) * 100));
  const isFavorite = book.collectionId === 'favorites';

  return (
    <div className="relative group flex flex-col items-center">
      {/* 3D Realistic Book Cover Object */}
      <div
        onClick={() => onOpen(book)}
        className="relative cursor-pointer transition-all duration-300 transform group-hover:-translate-y-3 group-hover:scale-[1.03]"
        style={{ perspective: '1000px' }}
      >
        {/* Book Container with Realistic Spine, Page Edge & Drop Shadow */}
        <div
          className="relative w-36 sm:w-44 md:w-48 aspect-[3/4.2] rounded-r-md rounded-l-xs overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow bg-stone-800"
          style={{
            boxShadow: '4px 6px 15px -2px rgba(0, 0, 0, 0.45), 1px 2px 4px rgba(0, 0, 0, 0.25)'
          }}
        >
          {/* Cover Image or Fallback */}
          {!imgError && book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-b from-stone-800 to-stone-900 text-amber-100 border border-amber-900/40">
              <div className="border border-amber-500/30 p-2 text-center h-full flex flex-col justify-between">
                <span className="text-[10px] uppercase tracking-widest text-amber-400/80 font-mono">
                  {book.format.toUpperCase()}
                </span>
                <div className="my-auto">
                  <h4 className="font-serif font-bold text-sm leading-snug line-clamp-3 text-amber-50">
                    {book.title}
                  </h4>
                  <p className="text-xs italic text-amber-200/80 mt-1 line-clamp-1">{book.author}</p>
                </div>
                <span className="text-[10px] opacity-40">BookNest</span>
              </div>
            </div>
          )}

          {/* Spine Fold Texture (Left spine shadow creating 3D depth) */}
          <div
            className="absolute left-0 top-0 bottom-0 w-3 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 30%, rgba(255,255,255,0.15) 60%, rgba(0,0,0,0.25) 100%)'
            }}
          />

          {/* Right Page Edges Texture */}
          <div
            className="absolute right-0 top-0 bottom-0 w-1.5 pointer-events-none opacity-80"
            style={{
              background: 'linear-gradient(to left, rgba(245, 235, 220, 0.4) 0%, transparent 100%)'
            }}
          />

          {/* Reading Progress Overlay Pill */}
          {progress > 0 && (
            <div className="absolute bottom-2 left-2 right-2 z-10 bg-black/75 backdrop-blur-xs px-2 py-1 rounded-md text-[10px] font-mono text-white flex items-center justify-between">
              <span className="text-amber-400 font-semibold">{progress}%</span>
              <span className="opacity-70 truncate max-w-[70px]">
                {book.isCompleted ? 'Finished' : `Pg ${book.currentPage || 1}`}
              </span>
            </div>
          )}

          {/* Quick Open Overlay on Hover */}
          <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
            <span className="px-3 py-1.5 bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-stone-100 text-xs font-medium rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Read</span>
            </span>
          </div>
        </div>

        {/* Realistic Book Shadow on Shelf */}
        <div
          className="w-full h-3 mx-auto mt-0.5 rounded-full pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Book Metadata Under Cover */}
      <div className="w-36 sm:w-44 md:w-48 mt-2 text-center">
        <h4
          onClick={() => onOpen(book)}
          className="font-serif font-medium text-sm text-stone-800 dark:text-stone-100 truncate hover:text-amber-700 dark:hover:text-amber-400 cursor-pointer transition-colors"
          title={book.title}
        >
          {book.title}
        </h4>
        <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5 font-sans">
          {book.author}
        </p>

        {/* Action button trigger */}
        <div className="relative mt-1 inline-block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-md hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
            title="Book options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {/* Context Menu Dropdown */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 bottom-full mb-1 z-40 w-48 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl p-1.5 text-left text-xs text-stone-800 dark:text-stone-200 animate-in fade-in zoom-in-95"
              >
                <button
                  onClick={() => {
                    onOpen(book);
                    setShowMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg hover:bg-stone-200/70 dark:hover:bg-stone-700/60 flex items-center gap-2 text-left"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>Open in Reader</span>
                </button>

                <button
                  onClick={() => {
                    onToggleFavorite(book);
                    setShowMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg hover:bg-stone-200/70 dark:hover:bg-stone-700/60 flex items-center gap-2 text-left"
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
                  <span>{isFavorite ? 'Remove Favorite' : 'Mark Favorite'}</span>
                </button>

                <button
                  onClick={() => {
                    onToggleComplete(book);
                    setShowMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg hover:bg-stone-200/70 dark:hover:bg-stone-700/60 flex items-center gap-2 text-left"
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${book.isCompleted ? 'text-emerald-500' : 'text-stone-400'}`} />
                  <span>{book.isCompleted ? 'Mark as In-Progress' : 'Mark as Completed'}</span>
                </button>

                {/* Move to collection */}
                <div className="py-1 border-t border-stone-200 dark:border-stone-700/60 my-1">
                  <span className="px-2 text-[10px] uppercase font-semibold text-stone-400 block mb-0.5">
                    Collection:
                  </span>
                  {collections.filter(c => c.id !== 'all' && c.id !== 'completed').map(col => (
                    <button
                      key={col.id}
                      onClick={() => {
                        onAssignCollection(book.id, col.id);
                        setShowMenu(false);
                      }}
                      className={`w-full px-2 py-1 text-[11px] rounded flex items-center justify-between ${
                        book.collectionId === col.id ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium' : 'hover:bg-stone-200/50 dark:hover:bg-stone-700/50'
                      }`}
                    >
                      <span className="truncate">{col.name}</span>
                      {book.collectionId === col.id && <span className="text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>

                <div className="pt-1 border-t border-stone-200 dark:border-stone-700/60">
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove "${book.title}" from your library?`)) {
                        onDelete(book.id);
                      }
                      setShowMenu(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center gap-2 text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Book</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
