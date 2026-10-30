import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Book } from '../../types/book';
import { Award, CheckCircle, RotateCcw, ArrowLeft, Clock } from 'lucide-react';

interface CompletionCelebrationModalProps {
  book: Book;
  totalReadingMinutes: number;
  onRestartBook: () => void;
  onReturnToLibrary: () => void;
  onClose: () => void;
}

export const CompletionCelebrationModal: React.FC<CompletionCelebrationModalProps> = ({
  book,
  totalReadingMinutes,
  onRestartBook,
  onReturnToLibrary,
  onClose
}) => {
  useEffect(() => {
    // Fire celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#e28743', '#873e23', '#1e3d59', '#17b978']
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 text-stone-900 dark:text-stone-100 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 dark:bg-amber-950/60 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
          <Award className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold">
          Volume Completed
        </span>

        <h3 className="text-2xl font-serif font-bold mt-1 text-stone-900 dark:text-stone-100">
          Congratulations!
        </h3>

        <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 font-serif italic">
          You have finished reading <strong className="font-semibold text-stone-800 dark:text-stone-200">"{book.title}"</strong> by {book.author}.
        </p>

        {/* Stats card */}
        <div className="mt-5 p-4 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 flex items-center justify-around">
          <div>
            <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 mb-0.5">
              <CheckCircle className="w-4 h-4" />
              <span className="font-mono font-bold text-lg">100%</span>
            </div>
            <span className="text-[11px] text-stone-400 uppercase tracking-wider">Completed</span>
          </div>

          <div className="w-[1px] h-8 bg-stone-200 dark:bg-stone-700" />

          <div>
            <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 mb-0.5">
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold text-lg">{totalReadingMinutes}m</span>
            </div>
            <span className="text-[11px] text-stone-400 uppercase tracking-wider">Time Read</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={onReturnToLibrary}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Personal Bookshelf</span>
          </button>

          <button
            onClick={onRestartBook}
            className="w-full py-2.5 bg-stone-200/80 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reread from Beginning</span>
          </button>
        </div>
      </div>
    </div>
  );
};
