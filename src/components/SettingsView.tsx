import React from 'react';
import { UserSettings, BookTheme, FontFamily, PageTurnMode } from '../types/book';
import { Sliders, RotateCcw, Volume2, Columns, Palette, Type, BookOpen } from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetSampleBooks: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetSampleBooks
}) => {
  const themes: { id: BookTheme; label: string; desc: string; bg: string; text: string; border: string }[] = [
    { id: 'sepia', label: 'Warm Sepia', desc: 'Warm cream paper with rich dark brown ink', bg: 'bg-[#f7f1e5]', text: 'text-[#382c20]', border: 'border-amber-300' },
    { id: 'light', label: 'Clean Light', desc: 'Crisp ivory paper with stark graphite text', bg: 'bg-[#faf9f6]', text: 'text-stone-900', border: 'border-stone-300' },
    { id: 'night', label: 'Soft Night', desc: 'Charcoal slate background comfortable at night', bg: 'bg-[#1e222b]', text: 'text-slate-200', border: 'border-slate-700' },
    { id: 'dark', label: 'Deep Dark', desc: 'OLED-optimized deep black background', bg: 'bg-[#0d0f12]', text: 'text-white', border: 'border-neutral-800' }
  ];

  const fonts: { id: FontFamily; label: string; desc: string }[] = [
    { id: 'serif', label: 'Lora Book Serif', desc: 'Classic literary proportions with calligraphic warmth' },
    { id: 'display', label: 'Cormorant Garamond', desc: 'Traditional elegant French editorial typography' },
    { id: 'sans', label: 'Plus Jakarta Sans', desc: 'Clean, crisp modern geometric sans' },
    { id: 'mono', label: 'JetBrains Mono', desc: 'Crisp tabular monospaced letterforms' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200 dark:border-stone-800">
        <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold">
          Preferences
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
          Settings & Reader Configuration
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Configure your default reading environment, typography scale, paper transitions, and library state.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {/* 1. Default Theme Selection */}
        <section className="p-6 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Default Reading Palette
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map((t) => (
              <div
                key={t.id}
                onClick={() => onUpdateSettings({ defaultTheme: t.id })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${t.bg} ${t.text} ${
                  settings.defaultTheme === t.id
                    ? 'border-amber-600 ring-2 ring-amber-500/20 shadow-md scale-[1.01]'
                    : `${t.border} opacity-80 hover:opacity-100`
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif font-bold text-sm">{t.label}</span>
                  {settings.defaultTheme === t.id && (
                    <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full font-sans">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs opacity-75">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Default Typography */}
        <section className="p-6 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Default Typeface & Proportions
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500 font-medium block mb-2">
                Preferred Typeface
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fonts.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => onUpdateSettings({ fontFamily: f.id })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      settings.fontFamily === f.id
                        ? 'border-amber-600 bg-amber-50/60 dark:bg-amber-950/30 font-medium'
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-sm font-semibold block text-stone-800 dark:text-stone-200">
                      {f.label}
                    </span>
                    <span className="text-xs text-stone-500">{f.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                  Base Font Size ({settings.fontSize}px)
                </label>
              </div>
              <input
                type="range"
                min="14"
                max="26"
                step="1"
                value={settings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* 3. Animation & Book Page Preferences */}
        <section className="p-6 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Page Simulation & Interaction
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500 font-medium block mb-2">
                Page Transition Animation
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['flip', 'slide', 'fade'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => onUpdateSettings({ pageTurnMode: mode })}
                    className={`p-3 rounded-xl border text-center capitalize transition-all ${
                      settings.pageTurnMode === mode
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <span className="text-sm block">
                      {mode === 'flip' ? '3D Realistic Flip' : mode === 'slide' ? 'Slide' : 'Instant Fade'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <Columns className="w-4 h-4 text-stone-400" />
                <div>
                  <span className="text-sm font-medium block text-stone-800 dark:text-stone-200">
                    Two-Page Spread on Large Displays
                  </span>
                  <span className="text-xs text-stone-500">
                    Displays facing left and right pages like an open physical book on desktop
                  </span>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ twoPageSpread: !settings.twoPageSpread })}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.twoPageSpread ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.twoPageSpread ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-stone-400" />
                <div>
                  <span className="text-sm font-medium block text-stone-800 dark:text-stone-200">
                    Synthesized Paper Turn Sound Effect
                  </span>
                  <span className="text-xs text-stone-500">
                    Plays a gentle rustle audio burst when turning physical pages
                  </span>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.soundEnabled ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* 4. Library Maintenance */}
        <section className="p-6 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <RotateCcw className="w-5 h-5 text-stone-500" />
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Library Maintenance
            </h3>
          </div>
          <p className="text-xs text-stone-500 mb-4">
            Reset default classic literary masterworks (Pride & Prejudice, Great Gatsby, Meditations, Frankenstein) if deleted or modified.
          </p>
          <button
            onClick={() => {
              if (window.confirm('Reset sample literary classics in library? Your imported books will be preserved.')) {
                onResetSampleBooks();
              }
            }}
            className="px-4 py-2 text-xs font-medium border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
          >
            Restore Default Classic Books
          </button>
        </section>
      </div>
    </div>
  );
};
