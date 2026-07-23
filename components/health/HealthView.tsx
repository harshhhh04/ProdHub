'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import { Activity, Dumbbell, Flame, Moon, Droplets, Footprints, CheckCircle, Circle } from 'lucide-react';

export const HealthView: React.FC = () => {
  const { healthLog, updateHealthLog } = useStore();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Health & Physical System</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Zero-friction consistency engine. No calories. Just energy, recovery, and cognitive maintenance.
          </p>
        </div>
      </div>

      {/* Grid of 5 Health Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Pillar 1: Workout */}
        <div
          onClick={() => updateHealthLog({ workoutDone: !healthLog.workoutDone })}
          className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
            healthLog.workoutDone
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-400 shadow-lg shadow-emerald-500/5'
              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] uppercase font-bold">WORKOUT</span>
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono">
              {healthLog.workoutDone ? 'COMPLETED ✓' : 'PENDING'}
            </div>
            <p className="text-[11px] font-sans opacity-80 mt-1 line-clamp-2">
              {healthLog.workoutNotes || 'Click to toggle today’s workout status'}
            </p>
          </div>
        </div>

        {/* Pillar 2: Meditation */}
        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-zinc-500 uppercase font-bold">MEDITATION</span>
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-zinc-100">
              {healthLog.meditationMinutes} mins
            </div>
            <div className="flex gap-1.5 mt-2">
              {[0, 10, 15, 20].map(mins => (
                <button
                  key={mins}
                  onClick={() => updateHealthLog({ meditationMinutes: mins })}
                  className={`flex-1 py-1 rounded text-[10px] font-mono border ${
                    healthLog.meditationMinutes === mins
                      ? 'bg-amber-500 text-black border-amber-400 font-bold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pillar 3: Sleep */}
        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-zinc-500 uppercase font-bold">SLEEP RECOVERY</span>
            <Moon className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-zinc-100">
              {healthLog.sleepHours} hrs
            </div>
            <div className="flex gap-1 mt-2">
              {[6, 7, 7.5, 8, 8.5].map(hrs => (
                <button
                  key={hrs}
                  onClick={() => updateHealthLog({ sleepHours: hrs })}
                  className={`flex-1 py-1 rounded text-[10px] font-mono border ${
                    healthLog.sleepHours === hrs
                      ? 'bg-indigo-500 text-black border-indigo-400 font-bold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {hrs}h
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pillar 4: Water */}
        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-zinc-500 uppercase font-bold">HYDRATION</span>
            <Droplets className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-zinc-100">
              {healthLog.waterLiters} L
            </div>
            <div className="flex gap-1.5 mt-2">
              {[2.0, 2.5, 3.0, 3.5].map(liters => (
                <button
                  key={liters}
                  onClick={() => updateHealthLog({ waterLiters: liters })}
                  className={`flex-1 py-1 rounded text-[10px] font-mono border ${
                    healthLog.waterLiters === liters
                      ? 'bg-cyan-400 text-black border-cyan-300 font-bold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {liters}L
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pillar 5: Walking */}
        <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-zinc-500 uppercase font-bold">DAILY MOVEMENT</span>
            <Footprints className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-zinc-100">
              {healthLog.walkingSteps.toLocaleString()} steps
            </div>
            <p className="text-[10px] font-mono text-zinc-500 mt-1">Goal: 8,000 steps</p>
          </div>
        </div>
      </div>

      {/* Workout Notes Box */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg space-y-2">
        <label className="text-xs font-mono text-zinc-400 uppercase font-bold">
          Today's Workout Notes & Session Breakdown
        </label>
        <textarea
          rows={3}
          value={healthLog.workoutNotes}
          onChange={(e) => updateHealthLog({ workoutNotes: e.target.value })}
          placeholder="E.g., Upper Body Heavy: Bench Press 85kg 4x6, Weighted Pullups..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-100 font-sans focus:outline-none focus:border-indigo-500 resize-none"
        />
      </div>
    </div>
  );
};
