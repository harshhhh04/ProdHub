'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { Calendar, Target, CheckCircle2, ArrowRight, X, AlertCircle } from 'lucide-react';

interface SundayPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SundayPlanningModal: React.FC<SundayPlanningModalProps> = ({ isOpen, onClose }) => {
  const { mode, missions, projects, applications } = useStore();
  const [step, setStep] = useState<number>(1);

  // Unfinished work check
  const unfinishedMissions = missions.filter(m => m.status === 'in_progress' || m.status === 'backlog');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300">
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-zinc-800 pb-3 flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-zinc-100">Guided Sunday Planning Workflow</h2>
            <p className="text-xs text-zinc-400">Design next week's operational priority and mission capacity.</p>
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className={`px-2.5 py-1 rounded border ${step === 1 ? 'bg-cyan-950 text-cyan-400 border-cyan-500 font-bold' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
            1. Review Backlog
          </span>
          <span className={`px-2.5 py-1 rounded border ${step === 2 ? 'bg-cyan-950 text-cyan-400 border-cyan-500 font-bold' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
            2. System Focus Area
          </span>
          <span className={`px-2.5 py-1 rounded border ${step === 3 ? 'bg-cyan-950 text-cyan-400 border-cyan-500 font-bold' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
            3. Finalize Plan
          </span>
        </div>

        {/* Step 1: Review Unfinished Work & Deadlines */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Approaching Deadlines & Applications
              </span>
              <p className="text-xs text-zinc-300">
                Active System Profile: <strong className="text-emerald-400 font-mono">{mode.toUpperCase()}</strong>.
                {applications.filter(a => a.status === 'OA' || a.status === 'Interview').length > 0
                  ? ' Active placement processes require priority flashcard drills.'
                  : ' Focus on core RTOS & Sentinel project milestones.'}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-300 uppercase font-bold">Unfinished Missions from Last Week</span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {unfinishedMissions.map(m => (
                  <div key={m.id} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-zinc-200">{m.title}</span>
                      <span className="text-[10px] font-mono text-zinc-500 block">Category: {m.category} | Est: {m.estimatedHours}h</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 text-amber-400 border border-zinc-800">
                      {m.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-4 py-2 rounded bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: System Focus Project */}
        {step === 2 && (
          <div className="space-y-4">
            <span className="text-xs font-mono text-zinc-300 uppercase font-bold">Select Primary Focus Project for Coming Week</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projects.map(p => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/60 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-100">{p.title}</span>
                    <span className="text-[10px] font-mono text-cyan-400">{p.progress}%</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">{p.overview}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded bg-zinc-900 text-zinc-400 text-xs font-mono"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-4 py-2 rounded bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400"
              >
                <span>Continue to Finalization</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Finalize Plan */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 space-y-2">
              <h4 className="font-mono font-bold text-xs uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sunday Plan Finalized
              </h4>
              <p className="text-xs leading-relaxed">
                Your weekly mission queue is primed. Prioritize Parkinson’s Law: 3 focal tasks per day, max 90m deep work sessions.
              </p>
            </div>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded bg-zinc-900 text-zinc-400 text-xs font-mono"
              >
                Back
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider"
              >
                Lock Sunday Plan & Begin Week
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
