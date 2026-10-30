import React, { useState } from 'react';
import { Book, Collection } from '../types/book';
import { BookCard } from './BookCard';
import { FolderPlus, Trash2, Folder, BookOpen, Plus, Tag } from 'lucide-react';

interface CollectionsViewProps {
  collections: Collection[];
  books: Book[];
  onOpenBook: (book: Book) => void;
  onCreateCollection: (name: string, description?: string) => void;
  onDeleteCollection: (id: string) => void;
  onToggleFavorite: (book: Book) => void;
  onToggleComplete: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onAssignCollection: (bookId: string, colId: string) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  collections,
  books,
  onOpenBook,
  onCreateCollection,
  onDeleteCollection,
  onToggleFavorite,
  onToggleComplete,
  onDeleteBook,
  onAssignCollection
}) => {
  const [selectedColId, setSelectedColId] = useState<string>(collections[0]?.id || 'all');
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeCollection = collections.find((c) => c.id === selectedColId) || collections[0];

  const collectionBooks = books.filter((b) => {
    if (selectedColId === 'all') return true;
    if (selectedColId === 'completed') return b.isCompleted;
    return b.collectionId === selectedColId;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    onCreateCollection(newColName.trim(), newColDesc.trim());
    setNewColName('');
    setNewColDesc('');
    setShowCreateModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold">
            Library Curations
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
            Collections & Shelves
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Organize your library into themed anthologies, genres, and personalized reading lists.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-xs shrink-0"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Main Layout: Collection Sidebar + Books Content */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Collection List Sidebar */}
        <div className="space-y-1.5 md:col-span-1">
          {collections.map((col) => {
            const count = books.filter((b) =>
              col.id === 'all' ? true : col.id === 'completed' ? b.isCompleted : b.collectionId === col.id
            ).length;
            const isSelected = col.id === selectedColId;

            return (
              <div
                key={col.id}
                onClick={() => setSelectedColId(col.id)}
                className={`w-full px-3.5 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-amber-100/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-medium border border-amber-300 dark:border-amber-800'
                    : 'hover:bg-stone-200/60 dark:hover:bg-stone-800/60 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Folder className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="text-sm truncate">{col.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono opacity-50 tabular-nums">
                    {count}
                  </span>
                  {!col.isSystem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete collection "${col.name}"?`)) {
                          onDeleteCollection(col.id);
                          if (selectedColId === col.id) setSelectedColId('all');
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-500 rounded transition-opacity"
                      title="Delete collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Books inside Selected Collection */}
        <div className="md:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                {activeCollection?.name}
              </h3>
              {activeCollection?.description && (
                <p className="text-xs text-stone-500 mt-0.5">{activeCollection.description}</p>
              )}
            </div>
            <span className="text-xs font-mono text-stone-400">
              {collectionBooks.length} {collectionBooks.length === 1 ? 'Volume' : 'Volumes'}
            </span>
          </div>

          {collectionBooks.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-6">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-stone-300 dark:text-stone-600" />
              <p className="text-sm font-serif font-medium text-stone-700 dark:text-stone-300">
                No volumes in this collection yet
              </p>
              <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                Use the three dots on any book card in your bookshelf to assign it to this collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {collectionBooks.map((book) => (
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
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 text-stone-900 dark:text-stone-100">
            <h3 className="text-base font-semibold mb-4">Create New Collection</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-stone-500 block mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  required
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  placeholder="e.g. Science Fiction & Space"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-stone-500 block mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newColDesc}
                  onChange={(e) => setNewColDesc(e.target.value)}
                  placeholder="e.g. Favorite speculative fiction masterworks"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-amber-700 hover:bg-amber-800 text-white rounded-xl shadow-xs"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
