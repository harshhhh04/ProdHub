'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import { Play, Search, Shield, Zap, Calendar, Award } from 'lucide-react';

interface HeaderProps {
  onOpenDeepWork: () => void;
  onOpenFridayReview: () => void;
  onOpenSundayPlanning: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDeepWork,
  onOpenFridayReview,
  onOpenSundayPlanning,
}) => {
  const { mode, toggleMode, setIsCommandPaletteOpen } = useStore();

  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search / Command Palette Trigger */}
      <button
        onClick={() => setIsCommandPaletteOpen(true)}
        className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs hover:border-zinc-700 hover:text-zinc-200 transition-all w-64 md:w-80"
      >
        <Search className="w-3.5 h-3.5 text-zinc-500" />
        <span className="flex-1 text-left">Search notes, missions, applications...</span>
        <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 font-mono border border-zinc-700">
          ⌘K
        </kbd>
      </button>

      {/* Action Controls & Mode Switcher */}
      <div className="flex items-center gap-3">
        {/* System Mode Switcher */}
        <button
          onClick={toggleMode}
          title="Click to toggle system focus mode"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono font-medium transition-all ${
            mode === 'placement'
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/50'
              : 'bg-indigo-950/40 border-indigo-800/60 text-indigo-400 hover:bg-indigo-900/50'
          }`}
        >
          {mode === 'placement' ? (
            <>
              <Shield className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>PLACEMENT MODE</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>BUILDER MODE</span>
            </>
          )}
        </button>

        {/* Guided Reviews Triggers */}
        <div className="hidden lg:flex items-center gap-2 border-l border-zinc-800 pl-3">
          <button
            onClick={onOpenFridayReview}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs hover:bg-zinc-800 transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Friday Review</span>
          </button>
          <button
            onClick={onOpenSundayPlanning}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs hover:bg-zinc-800 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sunday Planning</span>
          </button>
        </div>

        {/* Deep Work Primary Button */}
        <button
          onClick={onOpenDeepWork}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs shadow-lg shadow-emerald-500/10 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-black" />
          <span>Start Deep Work</span>
        </button>
      </div>
    </header>
  );
};
