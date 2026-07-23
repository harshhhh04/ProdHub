'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import {
  LayoutDashboard,
  Target,
  FolderGit2,
  BookOpen,
  HelpCircle,
  Briefcase,
  BookMarked,
  Activity,
  Cpu,
  Clock,
  ChevronRight
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'missions'
  | 'projects'
  | 'knowledge'
  | 'interview'
  | 'placement'
  | 'reading'
  | 'health';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { mode, deepWorkSessions, missions } = useStore();

  const totalDeepWorkHours = (
    deepWorkSessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60
  ).toFixed(1);

  const activeMissionsCount = missions.filter(m => m.status === 'in_progress').length;

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'missions', label: 'Weekly Missions', icon: Target, badge: activeMissionsCount },
    { id: 'projects', label: 'Projects Hub', icon: FolderGit2 },
    { id: 'knowledge', label: 'Knowledge Vault', icon: BookOpen },
    { id: 'interview', label: 'Interview Prep', icon: HelpCircle },
    { id: 'placement', label: 'Placement Tracker', icon: Briefcase },
    { id: 'reading', label: 'Reading List', icon: BookMarked },
    { id: 'health', label: 'Health System', icon: Activity },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800/80 bg-zinc-950 flex flex-col h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-sm text-zinc-100 tracking-tight">ENGINEERING OS</h1>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">v1.0 • Embedded Prep</p>
          </div>
        </div>
      </div>

      {/* Mode Status Ribbon */}
      <div className="px-4 py-2 bg-zinc-900/50 border-b border-zinc-800/50 flex items-center justify-between">
        <span className="text-[10px] font-mono text-zinc-400 uppercase">ACTIVE PROFILE</span>
        <span className={`text-[10px] font-mono font-bold uppercase ${mode === 'placement' ? 'text-emerald-400' : 'text-indigo-400'}`}>
          {mode}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100 font-semibold border-l-2 border-emerald-400'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge !== 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Metrics Bar */}
      <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/60">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[11px]">Deep Work Today</span>
          </div>
          <span className="font-mono font-bold text-zinc-200">{totalDeepWorkHours}h</span>
        </div>
        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all"
            style={{ width: `${Math.min(100, (Number(totalDeepWorkHours) / 4) * 100)}%` }}
          />
        </div>
      </div>
    </aside>
  );
};
