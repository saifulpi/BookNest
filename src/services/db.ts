import { Book, Bookmark, Highlight, Collection, UserSettings, ReadingSessionLog } from '../types/book';
import { SAMPLE_BOOKS, INITIAL_COLLECTIONS } from '../data/sampleBooks';

const DB_NAME = 'booknest_db';
const DB_VERSION = 1;

class BookNestDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('books')) {
          db.createObjectStore('books', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('bookmarks')) {
          const bookmarkStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
          bookmarkStore.createIndex('bookId', 'bookId', { unique: false });
        }
        if (!db.objectStoreNames.contains('highlights')) {
          const highlightStore = db.createObjectStore('highlights', { keyPath: 'id' });
          highlightStore.createIndex('bookId', 'bookId', { unique: false });
        }
        if (!db.objectStoreNames.contains('collections')) {
          db.createObjectStore('collections', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('readingLogs')) {
          db.createObjectStore('readingLogs', { keyPath: 'date' });
        }
      };

      request.onsuccess = async () => {
        const db = request.result;
        // Seed initial data if empty
        await this.seedInitialData(db);
        resolve(db);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  private async seedInitialData(db: IDBDatabase) {
    const tx = db.transaction(['books', 'collections'], 'readwrite');
    const bookStore = tx.objectStore('books');
    const collectionStore = tx.objectStore('collections');

    const countReq = bookStore.count();
    countReq.onsuccess = () => {
      if (countReq.result === 0) {
        SAMPLE_BOOKS.forEach((book) => bookStore.put(book));
      }
    };

    const collCountReq = collectionStore.count();
    collCountReq.onsuccess = () => {
      if (collCountReq.result === 0) {
        INITIAL_COLLECTIONS.forEach((col) => collectionStore.put(col));
      }
    };
  }

  async getAllBooks(): Promise<Book[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('books', 'readonly');
      const store = tx.objectStore('books');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getBookById(id: string): Promise<Book | undefined> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('books', 'readonly');
      const store = tx.objectStore('books');
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async saveBook(book: Book): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('books', 'readwrite');
      const store = tx.objectStore('books');
      const req = store.put(book);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async updateReadingProgress(bookId: string, page: number, totalPages?: number, isCompleted?: boolean): Promise<void> {
    const book = await this.getBookById(bookId);
    if (!book) return;
    book.currentPage = page;
    book.lastReadAt = Date.now();
    if (totalPages) book.totalPages = totalPages;
    if (isCompleted !== undefined) book.isCompleted = isCompleted;
    else if (totalPages && page >= totalPages) book.isCompleted = true;
    await this.saveBook(book);
  }

  async addReadingTime(bookId: string, additionalSeconds: number): Promise<void> {
    const book = await this.getBookById(bookId);
    if (!book) return;
    book.readingTimeSeconds = (book.readingTimeSeconds || 0) + additionalSeconds;
    book.lastReadAt = Date.now();
    await this.saveBook(book);

    // Also update daily log
    const today = new Date().toISOString().split('T')[0];
    const db = await this.getDB();
    const tx = db.transaction('readingLogs', 'readwrite');
    const store = tx.objectStore('readingLogs');
    const getReq = store.get(today);
    getReq.onsuccess = () => {
      const currentLog: ReadingSessionLog = getReq.result || {
        date: today,
        minutesRead: 0,
        pagesRead: 0,
        bookId
      };
      currentLog.minutesRead += Math.round(additionalSeconds / 60);
      store.put(currentLog);
    };
  }

  async deleteBook(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['books', 'bookmarks', 'highlights'], 'readwrite');
      tx.objectStore('books').delete(id);
      resolve();
    });
  }

  // Bookmarks
  async getBookmarks(bookId: string): Promise<Bookmark[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('bookmarks', 'readonly');
      const store = tx.objectStore('bookmarks');
      const index = store.index('bookId');
      const req = index.getAll(bookId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async saveBookmark(bookmark: Bookmark): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('bookmarks', 'readwrite');
      const store = tx.objectStore('bookmarks');
      const req = store.put(bookmark);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async deleteBookmark(bookmarkId: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('bookmarks', 'readwrite');
      const store = tx.objectStore('bookmarks');
      const req = store.delete(bookmarkId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Highlights & Notes
  async getHighlights(bookId: string): Promise<Highlight[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('highlights', 'readonly');
      const store = tx.objectStore('highlights');
      const index = store.index('bookId');
      const req = index.getAll(bookId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async saveHighlight(highlight: Highlight): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('highlights', 'readwrite');
      const store = tx.objectStore('highlights');
      const req = store.put(highlight);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async deleteHighlight(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('highlights', 'readwrite');
      const store = tx.objectStore('highlights');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Collections
  async getAllCollections(): Promise<Collection[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('collections', 'readonly');
      const store = tx.objectStore('collections');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async saveCollection(col: Collection): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('collections', 'readwrite');
      const store = tx.objectStore('collections');
      const req = store.put(col);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async deleteCollection(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('collections', 'readwrite');
      const store = tx.objectStore('collections');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Reading Logs
  async getReadingLogs(): Promise<ReadingSessionLog[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('readingLogs', 'readonly');
      const store = tx.objectStore('readingLogs');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }
}

export const dbService = new BookNestDatabase();

// LocalStorage helpers for User Settings
const SETTINGS_KEY = 'booknest_settings';

export const DEFAULT_SETTINGS: UserSettings = {
  defaultTheme: 'sepia',
  fontSize: 18,
  fontFamily: 'serif',
  lineSpacing: 'normal',
  readingWidth: 'medium',
  textAlign: 'justify',
  pageTurnMode: 'flip',
  twoPageSpread: true,
  soundEnabled: true,
  dropCaps: true
};

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}
