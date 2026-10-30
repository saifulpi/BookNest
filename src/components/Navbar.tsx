import React from 'react';
import { BookOpen, Plus, Sun, Moon } from 'lucide-react';
import { UserSettings } from '../types/book';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenImport: () => void;
  settings: UserSettings;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenImport,
  settings,
  onToggleTheme
}) => {
  const navLinks = [
    { id: 'bookshelf', label: 'Bookshelf' },
    { id: 'collections', label: 'Collections' },
    { id: 'bookmarks', label: 'Bookmarks' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-stone-50/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <button
          onClick={() => onTabChange('bookshelf')}
          className="flex items-center gap-2.5 text-left text-stone-900 dark:text-stone-100 whitespace-nowrap shrink-0 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center shadow-xs group-hover:bg-amber-800 transition-colors">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            BookNest
          </span>
        </button>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-300">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-amber-700 dark:text-amber-400 font-semibold'
                    : 'hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
            title="Toggle Light / Dark mode"
          >
            {settings.defaultTheme === 'light' || settings.defaultTheme === 'sepia' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={onOpenImport}
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Import Book</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-100/60 dark:bg-stone-850/60 overflow-x-auto text-xs">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${
                isActive
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
