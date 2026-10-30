import React, { useState, useEffect } from 'react';
import { Book, Collection, UserSettings } from './types/book';
import { dbService, loadSettings, saveSettings } from './services/db';
import { SAMPLE_BOOKS } from './data/sampleBooks';
import { Navbar } from './components/Navbar';
import { Bookshelf } from './components/Bookshelf';
import { CollectionsView } from './components/CollectionsView';
import { BookmarksView } from './components/BookmarksView';
import { ReadingStatsView } from './components/ReadingStatsView';
import { SettingsView } from './components/SettingsView';
import { ReaderView } from './components/Reader/ReaderView';
import { ImportBookModal } from './components/ImportBookModal';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [activeTab, setActiveTab] = useState<string>('bookshelf');
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync theme class on <html>
  useEffect(() => {
    const isDark = settings.defaultTheme === 'dark' || settings.defaultTheme === 'night';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveSettings(settings);
  }, [settings]);

  // Load books and collections from IndexedDB
  const refreshLibrary = async () => {
    try {
      const allBooks = await dbService.getAllBooks();
      const allCollections = await dbService.getAllCollections();
      setBooks(allBooks);
      setCollections(allCollections);
    } catch (e) {
      console.error('Failed to load library:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshLibrary();
  }, []);

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  };

  // Toggle Dark Mode
  const handleToggleTheme = () => {
    const nextTheme = settings.defaultTheme === 'dark' || settings.defaultTheme === 'night' ? 'sepia' : 'night';
    handleUpdateSettings({ defaultTheme: nextTheme });
  };

  // Open Book in Reader
  const handleOpenBook = (book: Book, targetPage?: number) => {
    if (targetPage) {
      const updated = { ...book, currentPage: targetPage };
      setActiveBook(updated);
    } else {
      setActiveBook(book);
    }
  };

  // Close Reader and return to library
  const handleCloseReader = async () => {
    setActiveBook(null);
    await refreshLibrary();
  };

  // Handle Book Import
  const handleBookImported = async (newBook: Book) => {
    await dbService.saveBook(newBook);
    await refreshLibrary();
    // Offer to read imported book immediately
    setActiveBook(newBook);
  };

  // Toggle Favorite
  const handleToggleFavorite = async (book: Book) => {
    const newColId = book.collectionId === 'favorites' ? 'all' : 'favorites';
    const updated = { ...book, collectionId: newColId };
    await dbService.saveBook(updated);
    await refreshLibrary();
  };

  // Toggle Complete
  const handleToggleComplete = async (book: Book) => {
    const updated = {
      ...book,
      isCompleted: !book.isCompleted,
      currentPage: !book.isCompleted ? book.totalPages : 1
    };
    await dbService.saveBook(updated);
    await refreshLibrary();
  };

  // Delete Book
  const handleDeleteBook = async (id: string) => {
    await dbService.deleteBook(id);
    await refreshLibrary();
  };

  // Assign to Collection
  const handleAssignCollection = async (bookId: string, colId: string) => {
    const book = await dbService.getBookById(bookId);
    if (!book) return;
    book.collectionId = colId;
    await dbService.saveBook(book);
    await refreshLibrary();
  };

  // Create Collection
  const handleCreateCollection = async (name: string, description?: string) => {
    const newCol: Collection = {
      id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      description
    };
    await dbService.saveCollection(newCol);
    await refreshLibrary();
  };

  // Delete Collection
  const handleDeleteCollection = async (id: string) => {
    await dbService.deleteCollection(id);
    await refreshLibrary();
  };

  // Restore Default Sample Classics
  const handleResetSampleBooks = async () => {
    for (const b of SAMPLE_BOOKS) {
      await dbService.saveBook(b);
    }
    await refreshLibrary();
  };

  // If active book is selected, render full-screen immersive Reader
  if (activeBook) {
    return (
      <ReaderView
        book={activeBook}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onBack={handleCloseReader}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenImport={() => setShowImportModal(true)}
        settings={settings}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Tab Views */}
      <main>
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center text-stone-400">
            <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-serif text-sm">Opening personal library...</p>
          </div>
        ) : (
          <>
            {activeTab === 'bookshelf' && (
              <Bookshelf
                books={books}
                collections={collections}
                settings={settings}
                onOpenBook={handleOpenBook}
                onOpenImport={() => setShowImportModal(true)}
                onToggleFavorite={handleToggleFavorite}
                onToggleComplete={handleToggleComplete}
                onDeleteBook={handleDeleteBook}
                onAssignCollection={handleAssignCollection}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'collections' && (
              <CollectionsView
                collections={collections}
                books={books}
                onOpenBook={handleOpenBook}
                onCreateCollection={handleCreateCollection}
                onDeleteCollection={handleDeleteCollection}
                onToggleFavorite={handleToggleFavorite}
                onToggleComplete={handleToggleComplete}
                onDeleteBook={handleDeleteBook}
                onAssignCollection={handleAssignCollection}
              />
            )}

            {activeTab === 'bookmarks' && (
              <BookmarksView
                books={books}
                onOpenBookAtPage={(b, page) => handleOpenBook(b, page)}
              />
            )}

            {activeTab === 'statistics' && (
              <ReadingStatsView books={books} />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onResetSampleBooks={handleResetSampleBooks}
              />
            )}
          </>
        )}
      </main>

      {/* Import Book Modal */}
      {showImportModal && (
        <ImportBookModal
          onBookImported={handleBookImported}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
}
