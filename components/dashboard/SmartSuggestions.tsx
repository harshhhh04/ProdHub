'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import { AlertTriangle, Info, ShieldAlert, Cpu } from 'lucide-react';

export const SmartSuggestions: React.FC = () => {
  const { mode, missions, projects, books, applications } = useStore();

  const generateSuggestions = () => {
    const list: { id: string; type: 'warning' | 'info'; text: string }[] = [];

    // Heuristics 1: Placement mode check
    if (mode === 'placement') {
      const interviewApps = applications.filter(a => a.status === 'Interview' || a.status === 'OA');
      if (interviewApps.length > 0) {
        list.push({
          id: 'sug-1',
          type: 'warning',
          text: `${interviewApps[0].company} ${interviewApps[0].status} process active (${interviewApps[0].role}). Prioritize RTOS and Embedded C flashcard revisions.`
        });
      }
    }

    // Heuristics 2: Inactive project check
    const rtosProject = projects.find(p => p.slug === 'rtos');
    if (rtosProject && rtosProject.progress < 100) {
      list.push({
        id: 'sug-2',
        type: 'info',
        text: 'RTOS Priority Inversion Mutex milestone incomplete. 2 pending DOD subtasks remaining.'
      });
    }

    // Heuristics 3: Mission completion velocity
    const completedCount = missions.filter(m => m.status === 'completed').length;
    const totalMissions = missions.length;
    if (totalMissions > 6 && completedCount < totalMissions * 0.5) {
      list.push({
        id: 'sug-3',
        type: 'info',
        text: `Velocity notice: You planned ${totalMissions} missions this week. Historical completion rate targets ~60%. Avoid over-commitment.`
      });
    }

    // Heuristics 4: Reading progress
    const activeBooks = books.filter(b => b.status === 'reading');
    if (activeBooks.length > 0 && activeBooks[0].progressPercent < 90) {
      list.push({
        id: 'sug-4',
        type: 'info',
        text: `Reading pace: "${activeBooks[0].title}" is at ${activeBooks[0].progressPercent}%. Extract key takeaways into Knowledge Vault.`
      });
    }

    return list;
  };

  const suggestions = generateSuggestions();

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <Cpu className="w-4 h-4 text-cyan-400" />
        <h3 className="text-xs font-mono uppercase font-bold text-zinc-300">
          SYSTEM HEURISTICS & SMART SUGGESTIONS
        </h3>
      </div>

      <div className="space-y-2">
        {suggestions.map(s => (
          <div
            key={s.id}
            className={`p-3 rounded-lg border flex items-start gap-2.5 text-xs ${
              s.type === 'warning'
                ? 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
            }`}
          >
            {s.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed font-sans">{s.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
