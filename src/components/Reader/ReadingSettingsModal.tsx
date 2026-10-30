import React from 'react';
import { UserSettings, BookTheme, FontFamily, PageTurnMode, ReadingWidth } from '../../types/book';
import { X, Volume2, VolumeX, BookOpen, Columns, AlignJustify, AlignLeft } from 'lucide-react';

interface ReadingSettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onClose: () => void;
}

export const ReadingSettingsModal: React.FC<ReadingSettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose
}) => {
  const themes: { id: BookTheme; label: string; bg: string; text: string; border: string }[] = [
    { id: 'light', label: 'Light', bg: 'bg-[#faf9f6]', text: 'text-stone-900', border: 'border-stone-300' },
    { id: 'sepia', label: 'Sepia', bg: 'bg-[#f7f1e5]', text: 'text-[#382c20]', border: 'border-amber-300' },
    { id: 'night', label: 'Night', bg: 'bg-[#1e222b]', text: 'text-slate-200', border: 'border-slate-700' },
    { id: 'dark', label: 'Dark', bg: 'bg-[#0d0f12]', text: 'text-white', border: 'border-neutral-800' }
  ];

  const fontFamilies: { id: FontFamily; label: string; fontName: string }[] = [
    { id: 'serif', label: 'Lora (Book Serif)', fontName: 'font-[family-name:var(--font-serif)]' },
    { id: 'display', label: 'Cormorant (Editorial)', fontName: 'font-[family-name:var(--font-display)]' },
    { id: 'sans', label: 'Plus Jakarta (Modern)', fontName: 'font-[family-name:var(--font-sans)]' },
    { id: 'mono', label: 'JetBrains Mono', fontName: 'font-[family-name:var(--font-mono)]' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 text-stone-900 dark:text-stone-100 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-semibold tracking-tight">Reading Preferences</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 pt-5">
          {/* 1. Themes */}
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium block mb-2.5">
              Reading Theme
            </label>
            <div className="grid grid-cols-4 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onUpdateSettings({ defaultTheme: t.id })}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all ${t.bg} ${t.text} ${
                    settings.defaultTheme === t.id
                      ? 'border-amber-600 shadow-md ring-2 ring-amber-500/20 scale-[1.02]'
                      : `${t.border} opacity-80 hover:opacity-100`
                  }`}
                >
                  <span className="text-base font-serif font-semibold">Aa</span>
                  <span className="text-[11px] mt-1 font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Font Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">
                Font Size
              </label>
              <span className="text-xs font-mono tabular-nums text-stone-600 dark:text-stone-300">
                {settings.fontSize}px
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdateSettings({ fontSize: Math.max(14, settings.fontSize - 1) })}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-200/80 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                A-
              </button>
              <input
                type="range"
                min="14"
                max="26"
                step="1"
                value={settings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                className="flex-1 accent-amber-600 cursor-pointer"
              />
              <button
                onClick={() => onUpdateSettings({ fontSize: Math.min(26, settings.fontSize + 1) })}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-stone-200/80 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                A+
              </button>
            </div>
          </div>

          {/* 3. Font Family */}
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium block mb-2">
              Typeface
            </label>
            <div className="grid grid-cols-2 gap-2">
              {fontFamilies.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onUpdateSettings({ fontFamily: f.id })}
                  className={`p-2.5 text-left rounded-xl border text-sm transition-all ${f.fontName} ${
                    settings.fontFamily === f.id
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-semibold shadow-xs'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Line Spacing & Text Align */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium block mb-2">
                Line Spacing
              </label>
              <div className="flex p-1 bg-stone-200/70 dark:bg-stone-800 rounded-lg text-xs">
                {(['compact', 'normal', 'relaxed'] as const).map((space) => (
                  <button
                    key={space}
                    onClick={() => onUpdateSettings({ lineSpacing: space })}
                    className={`flex-1 py-1.5 capitalize rounded-md transition-colors ${
                      settings.lineSpacing === space
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-medium'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    {space}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium block mb-2">
                Alignment
              </label>
              <div className="flex p-1 bg-stone-200/70 dark:bg-stone-800 rounded-lg text-xs">
                <button
                  onClick={() => onUpdateSettings({ textAlign: 'justify' })}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md transition-colors ${
                    settings.textAlign === 'justify'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-medium'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                  <span>Justify</span>
                </button>
                <button
                  onClick={() => onUpdateSettings({ textAlign: 'left' })}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md transition-colors ${
                    settings.textAlign === 'left'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-medium'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>Left</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5. Reading Width & Page Animation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium block mb-2">
                Reading Width
              </label>
              <div className="flex p-1 bg-stone-200/70 dark:bg-stone-800 rounded-lg text-xs">
                {(['narrow', 'medium', 'wide'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => onUpdateSettings({ readingWidth: w })}
                    className={`flex-1 py-1.5 capitalize rounded-md transition-colors ${
                      settings.readingWidth === w
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-medium'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium block mb-2">
                Page Animation
              </label>
              <div className="flex p-1 bg-stone-200/70 dark:bg-stone-800 rounded-lg text-xs">
                {(['flip', 'slide', 'fade'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => onUpdateSettings({ pageTurnMode: mode })}
                    className={`flex-1 py-1.5 capitalize rounded-md transition-colors ${
                      settings.pageTurnMode === mode
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs font-medium'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Toggles: Dual Page, Sound, Drop Caps */}
          <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <Columns className="w-4 h-4 text-stone-400" />
                <span className="text-sm">Two-Page Spread (Desktop)</span>
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

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-stone-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-stone-400" />
                )}
                <span className="text-sm">Paper Turn Sound Effect</span>
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

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-stone-400">D</span>
                <span className="text-sm">Editorial Drop Caps</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ dropCaps: !settings.dropCaps })}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.dropCaps ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.dropCaps ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
