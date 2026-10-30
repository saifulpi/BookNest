export type BookFormat = 'epub' | 'pdf' | 'txt' | 'builtin';

export type BookTheme = 'light' | 'sepia' | 'night' | 'dark';

export type FontFamily = 'serif' | 'display' | 'sans' | 'mono';

export type PageTurnMode = 'flip' | 'slide' | 'fade';

export type ReadingWidth = 'narrow' | 'medium' | 'wide';

export interface Chapter {
  id: string;
  title: string;
  content: string; // Plain text or HTML formatted string
  wordCount?: number;
}

export interface BookPage {
  pageNumber: number;
  chapterIndex: number;
  chapterTitle: string;
  content: string;
  type?: 'text' | 'pdf-canvas';
}

export interface Bookmark {
  id: string;
  bookId: string;
  page: number;
  chapterTitle: string;
  snippet: string;
  createdAt: number;
}

export interface Highlight {
  id: string;
  bookId: string;
  page: number;
  chapterIndex: number;
  text: string;
  color: 'amber' | 'emerald' | 'rose' | 'sky';
  note?: string;
  createdAt: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  format: BookFormat;
  coverUrl: string;
  genre: string;
  collectionId: string;
  addedAt: number;
  lastReadAt: number;
  currentPage: number;
  totalPages: number;
  readingTimeSeconds: number;
  isCompleted: boolean;
  fileData?: ArrayBuffer | string; // Stored in IndexedDB for imported files
  chapters: Chapter[];
  customCoverColor?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  isSystem?: boolean;
}

export interface UserSettings {
  defaultTheme: BookTheme;
  fontSize: number; // 14 to 28
  fontFamily: FontFamily;
  lineSpacing: 'compact' | 'normal' | 'relaxed';
  readingWidth: ReadingWidth;
  textAlign: 'left' | 'justify';
  pageTurnMode: PageTurnMode;
  twoPageSpread: boolean;
  soundEnabled: boolean;
  dropCaps: boolean;
}

export interface ReadingSessionLog {
  date: string; // YYYY-MM-DD
  minutesRead: number;
  pagesRead: number;
  bookId: string;
}
