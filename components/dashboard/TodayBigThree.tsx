'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { CheckCircle2, Circle, Trophy, Edit3, Save, Sparkles } from 'lucide-react';

export const TodayBigThree: React.FC = () => {
  const { bigThree, updateBigThree } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [t1, setT1] = useState(bigThree.task1);
  const [t2, setT2] = useState(bigThree.task2);
  const [t3, setT3] = useState(bigThree.task3);

  const completedCount = [bigThree.completed1, bigThree.completed2, bigThree.completed3].filter(Boolean).length;
  const isAllComplete = completedCount === 3;

  const handleSave = () => {
    updateBigThree({
      task1: t1,
      task2: t2,
      task3: t3
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
      {/* Top Banner Accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isAllComplete ? 'bg-emerald-400' : 'bg-zinc-800'}`} />

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-emerald-400">
              DAILY PROTOCOL
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              {completedCount} / 3 Completed
            </span>
          </div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2 mt-0.5">
            <span>Today's Big 3</span>
            {isAllComplete && (
              <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                <Sparkles className="w-3.5 h-3.5" /> DAY SUCCESSFUL
              </span>
            )}
          </h2>
        </div>

        <button
          onClick={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
        >
          {isEditing ? (
            <>
              <Save className="w-3.5 h-3.5 text-emerald-400" /> Save
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5 text-zinc-400" /> Edit Tasks
            </>
          )}
        </button>
      </div>

      {!isEditing ? (
        <div className="space-y-2.5">
          {/* Task 1 */}
          <div
            onClick={() => updateBigThree({ completed1: !bigThree.completed1 })}
            className={`group flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
              bigThree.completed1
                ? 'bg-zinc-900/40 border-zinc-800/60 opacity-60 line-through text-zinc-400'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-100 hover:border-emerald-500/50'
            }`}
          >
            {bigThree.completed1 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 mt-0.5 shrink-0 transition-colors" />
            )}
            <span className="text-xs font-medium leading-relaxed">1. {bigThree.task1}</span>
          </div>

          {/* Task 2 */}
          <div
            onClick={() => updateBigThree({ completed2: !bigThree.completed2 })}
            className={`group flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
              bigThree.completed2
                ? 'bg-zinc-900/40 border-zinc-800/60 opacity-60 line-through text-zinc-400'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-100 hover:border-emerald-500/50'
            }`}
          >
            {bigThree.completed2 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 mt-0.5 shrink-0 transition-colors" />
            )}
            <span className="text-xs font-medium leading-relaxed">2. {bigThree.task2}</span>
          </div>

          {/* Task 3 */}
          <div
            onClick={() => updateBigThree({ completed3: !bigThree.completed3 })}
            className={`group flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
              bigThree.completed3
                ? 'bg-zinc-900/40 border-zinc-800/60 opacity-60 line-through text-zinc-400'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-100 hover:border-emerald-500/50'
            }`}
          >
            {bigThree.completed3 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 mt-0.5 shrink-0 transition-colors" />
            )}
            <span className="text-xs font-medium leading-relaxed">3. {bigThree.task3}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-mono text-zinc-500 uppercase">Focus Task #1</label>
            <input
              type="text"
              value={t1}
              onChange={(e) => setT1(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-100 font-sans focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-zinc-500 uppercase">Focus Task #2</label>
            <input
              type="text"
              value={t2}
              onChange={(e) => setT2(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-100 font-sans focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-zinc-500 uppercase">Focus Task #3</label>
            <input
              type="text"
              value={t3}
              onChange={(e) => setT3(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-100 font-sans focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
