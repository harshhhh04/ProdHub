'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { TodayBigThree } from './TodayBigThree';
import { SmartSuggestions } from './SmartSuggestions';
import { NavTab } from '../layout/Sidebar';
import {
  Play,
  Clock,
  Briefcase,
  Target,
  FolderGit2,
  BookMarked,
  Activity,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenDeepWork: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab, onOpenDeepWork }) => {
  const { mode, missions, projects, deepWorkSessions, books, healthLog, applications } = useStore();
  const [quickNote, setQuickNote] = useState('');

  // Calculations
  const activeMissions = missions.filter(m => m.status === 'in_progress');
  const completedMissions = missions.filter(m => m.status === 'completed');
  const missionProgressPct = missions.length > 0 
    ? Math.round((completedMissions.length / missions.length) * 100) 
    : 0;

  const todayDeepWorkMins = deepWorkSessions
    .filter(s => s.timestamp.startsWith(new Date().toISOString().split('T')[0]))
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  // Filter projects depending on Placement vs Builder mode
  const displayedProjects = projects.filter(p => {
    if (mode === 'placement') {
      return p.category === 'internship' || p.slug === 'core-systems' || p.slug === 'research-project';
    } else {
      return p.slug === 'personal-project' || p.category === 'freelance' || p.category === 'core';
    }
  });

  const nextInterview = applications.find(a => a.status === 'Interview' || a.status === 'OA');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
              mode === 'placement' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' : 'bg-indigo-950/80 text-indigo-400 border border-indigo-800'
            }`}>
              SYSTEM MODE: {mode.toUpperCase()}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              • Target Review Window: Active
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
            {mode === 'placement' ? 'Technical Preparation & High-Priority Command' : 'Engineering System & Development Lab'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {mode === 'placement' 
              ? 'Focus area: Professional Work module, core system synchronization, and technical interview revision.'
              : 'Focus area: Personal project framework, custom kernel extensions, and freelance engineering.'}
          </p>
        </div>

        <button
          onClick={onOpenDeepWork}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/10 transition-all shrink-0"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>Start Deep Work</span>
        </button>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Placement / Review Countdown */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-mono uppercase text-[10px]">TECHNICAL REVIEW PIPELINE</span>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-zinc-100">
              {nextInterview ? `Upcoming Technical Interview` : 'Target Prep Active'}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5 truncate">
              {nextInterview ? `${nextInterview.company} • ${nextInterview.status}` : 'Target window active'}
            </div>
          </div>
        </div>

        {/* Card 2: Deep Work Today */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-mono uppercase text-[10px]">DEEP WORK TODAY</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-zinc-100">
              {(todayDeepWorkMins / 60).toFixed(1)} hrs
            </div>
            <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
              Goal: 3.5 hrs / day
            </div>
          </div>
        </div>

        {/* Card 3: Weekly Mission Progress */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-mono uppercase text-[10px]">WEEKLY MISSIONS</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-zinc-100">
              {missionProgressPct}%
            </div>
            <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
              {completedMissions.length} of {missions.length} Completed
            </div>
          </div>
        </div>

        {/* Card 4: Health Snapshot */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-mono uppercase text-[10px]">HEALTH STACK</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-zinc-100">
              {healthLog.workoutDone ? 'Workout ✓' : 'Workout Pending'}
            </div>
            <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
              Meditation: {healthLog.meditationMinutes}m | Sleep: {healthLog.sleepHours}h
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Today's Big 3 & Active Missions), Right Column (Suggestions, Projects, Reading) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Big 3 */}
          <TodayBigThree />

          {/* Active Missions Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <h2 className="font-mono font-bold text-sm text-zinc-200 uppercase">
                  ACTIVE MISSIONS ({activeMissions.length})
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('missions')}
                className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>View All Missions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeMissions.map(m => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-start justify-between gap-3 hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        m.priority === 'P0' ? 'bg-red-950/80 text-red-400 border border-red-800' : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {m.priority}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                        {m.category}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        Est: {m.estimatedHours}h | Act: {m.actualHours}h
                      </span>
                    </div>
                    <h3 className="text-xs font-semibold text-zinc-100">{m.title}</h3>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">{m.description}</p>
                  </div>

                  <button
                    onClick={onOpenDeepWork}
                    className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-emerald-500 hover:text-black text-emerald-400 text-xs font-mono transition-all shrink-0 flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Focus</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Notes Scratchpad */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg space-y-2">
            <label className="text-xs font-mono font-bold text-zinc-400 uppercase">
              QUICK SCRATCHPAD NOTES
            </label>
            <textarea
              rows={3}
              placeholder="Jot down quick thoughts, register offsets, or architecture notes..."
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Smart Suggestions */}
          <SmartSuggestions />

          {/* Mode Priority Projects */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono font-bold text-xs text-zinc-200 uppercase">
                  {mode === 'placement' ? 'TECHNICAL PRIORITY PROJECTS' : 'DEVELOPMENT LAB PROJECTS'}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 font-mono"
              >
                All Projects
              </button>
            </div>

            <div className="space-y-2.5">
              {displayedProjects.map(p => (
                <div
                  key={p.id}
                  onClick={() => setActiveTab('projects')}
                  className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200">{p.title}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">{p.progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reading & Books Overview */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-indigo-400" />
                <h3 className="font-mono font-bold text-xs text-zinc-200 uppercase">
                  CURRENT READING
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('reading')}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 font-mono"
              >
                Reading Vault
              </button>
            </div>

            {books.filter(b => b.status === 'reading').map(b => (
              <div key={b.id} className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-200">{b.title}</span>
                  <span className="text-[10px] font-mono text-indigo-400">{b.progressPercent}%</span>
                </div>
                <p className="text-[10px] text-zinc-500">by {b.author}</p>
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-400 h-full rounded-full"
                    style={{ width: `${b.progressPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
