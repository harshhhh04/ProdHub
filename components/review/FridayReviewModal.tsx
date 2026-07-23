'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { Award, CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, X } from 'lucide-react';

interface FridayReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FridayReviewModal: React.FC<FridayReviewModalProps> = ({ isOpen, onClose }) => {
  const { deepWorkSessions, missions, books, healthLog, addWeeklyReview } = useStore();

  const [wins, setWins] = useState('');
  const [bottlenecks, setBottlenecks] = useState('');
  const [learnings, setLearnings] = useState('');
  const [changesNextWeek, setChangesNextWeek] = useState('');

  if (!isOpen) return null;

  // Auto aggregated metrics
  const totalDeepWorkHours = (deepWorkSessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60).toFixed(1);
  const completedMissions = missions.filter(m => m.status === 'completed').length;
  const missionCompletionPct = missions.length > 0 ? Math.round((completedMissions / missions.length) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWeeklyReview({
      weekStartDate: new Date().toISOString().split('T')[0],
      deepWorkHours: Number(totalDeepWorkHours),
      missionsCompletedPct: missionCompletionPct,
      wins,
      bottlenecks,
      learnings,
      changesNextWeek
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300">
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-zinc-800 pb-3 flex items-center gap-3">
          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-zinc-100">Guided Friday Review</h2>
            <p className="text-xs text-zinc-400">Review instead of guilt. Honest continuous improvement.</p>
          </div>
        </div>

        {/* Aggregated Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 text-xs font-mono">
          <div>
            <span className="text-zinc-500 uppercase text-[10px]">DEEP WORK HOURS</span>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{totalDeepWorkHours} hrs</div>
          </div>
          <div>
            <span className="text-zinc-500 uppercase text-[10px]">MISSION COMPLETION</span>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{missionCompletionPct}% ({completedMissions}/{missions.length})</div>
          </div>
          <div>
            <span className="text-zinc-500 uppercase text-[10px]">READING PROGRESS</span>
            <div className="text-lg font-bold text-indigo-400 mt-0.5">{books[0]?.progressPercent || 0}%</div>
          </div>
          <div>
            <span className="text-zinc-500 uppercase text-[10px]">HEALTH STACK</span>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">{healthLog.workoutDone ? 'Workout ✓' : 'Active'}</div>
          </div>
        </div>

        {/* Guided Prompts */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="font-mono text-zinc-300 font-semibold uppercase block mb-1">
              1. What went exceptionally well this week?
            </label>
            <textarea
              rows={2}
              required
              placeholder="E.g., Solved RTOS priority inversion context switch bug, maintained 90m deep work blocks..."
              value={wins}
              onChange={(e) => setWins(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div>
            <label className="font-mono text-zinc-300 font-semibold uppercase block mb-1">
              2. What slowed me down or caused friction?
            </label>
            <textarea
              rows={2}
              required
              placeholder="E.g., Over-committing to 12 missions instead of focusing on Big 3..."
              value={bottlenecks}
              onChange={(e) => setBottlenecks(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div>
            <label className="font-mono text-zinc-300 font-semibold uppercase block mb-1">
              3. What key engineering or strategic lessons did I learn?
            </label>
            <textarea
              rows={2}
              required
              placeholder="E.g., Memory barriers (DSB/ISB) are required when modifying Cortex-M NVIC vectors dynamically..."
              value={learnings}
              onChange={(e) => setLearnings(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div>
            <label className="font-mono text-zinc-300 font-semibold uppercase block mb-1">
              4. What specific operational change will I make next week?
            </label>
            <textarea
              rows={2}
              required
              placeholder="E.g., Cap weekly missions to max 7 high-impact targets..."
              value={changesNextWeek}
              onChange={(e) => setChangesNextWeek(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200 font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold uppercase tracking-wider"
            >
              Log Friday Review & Seal Week
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
