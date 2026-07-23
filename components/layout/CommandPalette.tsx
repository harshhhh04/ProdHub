'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { Search, Play, Shield, Zap, Target, BookOpen, Briefcase, HelpCircle, X } from 'lucide-react';
import { NavTab } from './Sidebar';

interface CommandPaletteProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenDeepWork: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ setActiveTab, onOpenDeepWork }) => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    mode,
    toggleMode,
    missions,
    notes,
    projects,
    interviewQuestions,
    applications
  } = useStore();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredMissions = missions.filter(m =>
    m.title.toLowerCase().includes(query.toLowerCase()) || m.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(query.toLowerCase()) || n.content.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredApps = applications.filter(a =>
    a.company.toLowerCase().includes(query.toLowerCase()) || a.role.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/60">
          <Search className="w-4 h-4 text-emerald-400" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search notes, missions, applications..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-3 overflow-y-auto space-y-4">
          {/* Quick Actions */}
          {!query && (
            <div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase px-2 mb-1.5">System Actions</p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    onOpenDeepWork();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 text-xs text-zinc-200"
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Start 90m Deep Work Session</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-zinc-500">Action</kbd>
                </button>

                <button
                  onClick={() => {
                    toggleMode();
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 text-xs text-zinc-200"
                >
                  <div className="flex items-center gap-2">
                    {mode === 'placement' ? (
                      <Zap className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>Switch Mode to {mode === 'placement' ? 'BUILDER MODE' : 'PLACEMENT MODE'}</span>
                  </div>
                  <kbd className="text-[10px] font-mono text-zinc-500">Toggle</kbd>
                </button>
              </div>
            </div>
          )}

          {/* Missions */}
          {filteredMissions.length > 0 && (
            <div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase px-2 mb-1.5 flex items-center gap-1">
                <Target className="w-3 h-3 text-emerald-400" /> Missions
              </p>
              <div className="space-y-1">
                {filteredMissions.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveTab('missions');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-900 text-xs text-zinc-300"
                  >
                    <span className="truncate">{m.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {m.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Notes */}
          {filteredNotes.length > 0 && (
            <div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase px-2 mb-1.5 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-cyan-400" /> Knowledge Vault
              </p>
              <div className="space-y-1">
                {filteredNotes.map(n => (
                  <button
                    key={n.id}
                    onClick={() => {
                      setActiveTab('knowledge');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-900 text-xs text-zinc-300"
                  >
                    <span className="truncate">{n.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {n.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Placement Applications */}
          {filteredApps.length > 0 && (
            <div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase px-2 mb-1.5 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-amber-400" /> Placement Applications
              </p>
              <div className="space-y-1">
                {filteredApps.map(a => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setActiveTab('placement');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-900 text-xs text-zinc-300"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-200">{a.company}</span>
                      <span className="text-zinc-500">• {a.role}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-emerald-400 border border-zinc-800">
                      {a.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>Engineering OS Command Palette</span>
          <span>Esc to Close</span>
        </div>
      </div>
    </div>
  );
};
