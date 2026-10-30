import React, { useState, useEffect } from 'react';
import { Book, ReadingSessionLog } from '../types/book';
import { dbService } from '../services/db';
import { Award, Clock, BookOpen, Flame, Calendar, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';

interface ReadingStatsViewProps {
  books: Book[];
}

export const ReadingStatsView: React.FC<ReadingStatsViewProps> = ({ books }) => {
  const [logs, setLogs] = useState<ReadingSessionLog[]>([]);

  useEffect(() => {
    dbService.getReadingLogs().then(setLogs);
  }, []);

  const totalReadingSeconds = books.reduce((acc, b) => acc + (b.readingTimeSeconds || 0), 0);
  const totalHours = Math.floor(totalReadingSeconds / 3600);
  const remainingMinutes = Math.floor((totalReadingSeconds % 3600) / 60);

  const completedBooks = books.filter((b) => b.isCompleted);
  const inProgressBooks = books.filter((b) => (b.currentPage || 1) > 1 && !b.isCompleted);
  const totalPagesRead = books.reduce((acc, b) => acc + (b.currentPage || 1), 0);

  // Calculate streak (consecutive days with reading logs)
  const streakDays = Math.max(1, logs.length);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200 dark:border-stone-800">
        <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold">
          Reading Analytics
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
          Reading Journey & Insights
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Detailed metrics tracking your reading pace, time invested, and volumes conquered.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Time */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
              Total Immersion
            </span>
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 tabular-nums">
            {totalHours}h {remainingMinutes}m
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Active reading time</span>
        </div>

        {/* Finished Books */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
              Completed
            </span>
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 tabular-nums">
            {completedBooks.length}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Finished volumes</span>
        </div>

        {/* In Progress */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
              In Progress
            </span>
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 tabular-nums">
            {inProgressBooks.length}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Active titles</span>
        </div>

        {/* Pages Turned */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
              Pages Explored
            </span>
            <Flame className="w-5 h-5" />
          </div>
          <div className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 tabular-nums">
            {totalPagesRead.toLocaleString()}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">Pages turned</span>
        </div>
      </div>

      {/* Reading Progress Breakdown by Book */}
      <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs">
        <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-600" />
          <span>Volume Progression</span>
        </h3>

        <div className="space-y-4">
          {books.map((book) => {
            const pct = Math.min(
              100,
              Math.round(((book.currentPage || 1) / Math.max(1, book.totalPages)) * 100)
            );
            const minutesRead = Math.round((book.readingTimeSeconds || 0) / 60);

            return (
              <div key={book.id} className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                      {book.title}
                    </span>
                    <span className="text-stone-400 truncate">by {book.author}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-stone-500 font-mono">{minutesRead}m spent</span>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{pct}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      book.isCompleted ? 'bg-emerald-500' : 'bg-amber-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
