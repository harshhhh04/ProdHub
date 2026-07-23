'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import { AlertTriangle, Info, Cpu } from 'lucide-react';

export const SmartSuggestions: React.FC = () => {
  const { mode, missions, projects, books, applications } = useStore();

  const generateSuggestions = () => {
    const list: { id: string; type: 'warning' | 'info'; text: string }[] = [];

    // Generic suggestion 1: High priority mission status
    const highPriorityMissions = missions.filter(m => m.priority === 'P0' && m.status === 'in_progress');
    if (highPriorityMissions.length > 0) {
      list.push({
        id: 'sug-1',
        type: 'warning',
        text: 'A high priority mission hasn\'t been updated recently.'
      });
    }

    // Generic suggestion 2: Active project notice
    const activeProject = projects.find(p => p.status === 'active');
    if (activeProject) {
      list.push({
        id: 'sug-2',
        type: 'info',
        text: 'One project has been inactive for several days.'
      });
    }

    // Generic suggestion 3: Mission completion velocity
    const completedCount = missions.filter(m => m.status === 'completed').length;
    const totalMissions = missions.length;
    const completionPct = totalMissions > 0 ? Math.round((completedCount / totalMissions) * 100) : 70;
    list.push({
      id: 'sug-3',
      type: 'info',
      text: `Your weekly goals are ${completionPct}% complete.`
    });

    // Generic suggestion 4: Reading progress
    const activeBooks = books.filter(b => b.status === 'reading');
    if (activeBooks.length > 0) {
      list.push({
        id: 'sug-4',
        type: 'info',
        text: 'Your reading progress has slowed this week.'
      });
    }

    // Generic suggestion 5: Deep work prompt
    list.push({
      id: 'sug-5',
      type: 'info',
      text: 'Consider scheduling another deep work session.'
    });

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
