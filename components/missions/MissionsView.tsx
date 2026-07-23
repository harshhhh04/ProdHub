'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { Mission, Priority, MissionStatus } from '@/lib/types';
import { Target, Plus, CheckSquare, Square, Clock, AlertCircle, Play, Trash2, X } from 'lucide-react';

interface MissionsViewProps {
  onOpenDeepWork: () => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({ onOpenDeepWork }) => {
  const { missions, addMission, updateMission, deleteMission, toggleSubtask } = useStore();

  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Mission Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('P1');
  const [category, setCategory] = useState('RTOS');
  const [deadline, setDeadline] = useState('2026-08-01');
  const [estimatedHours, setEstimatedHours] = useState(4);
  const [dodText, setDodText] = useState('');

  const filteredMissions = missions.filter(m => {
    if (selectedPriority !== 'ALL' && m.priority !== selectedPriority) return false;
    if (selectedStatus !== 'ALL' && m.status !== selectedStatus) return false;
    return true;
  });

  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const dodItems = dodText
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map((text, idx) => ({ id: `dod-${Date.now()}-${idx}`, text, completed: false }));

    addMission({
      title,
      description,
      priority,
      category,
      status: 'in_progress',
      deadline,
      estimatedHours: Number(estimatedHours),
      actualHours: 0,
      definitionOfDone: dodItems,
      notes: ''
    });

    setTitle('');
    setDescription('');
    setDodText('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Title & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Weekly Mission System</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Mission-first architecture. High impact targets over endless task lists.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="P0">P0 - Critical</option>
            <option value="P1">P1 - High</option>
            <option value="P2">P2 - Medium</option>
            <option value="P3">P3 - Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="backlog">Backlog</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Mission</span>
          </button>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMissions.map(m => {
          const dodCompleted = m.definitionOfDone.filter(d => d.completed).length;
          const dodTotal = m.definitionOfDone.length;
          const dodPct = dodTotal > 0 ? Math.round((dodCompleted / dodTotal) * 100) : 0;

          return (
            <div
              key={m.id}
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-zinc-700 transition-all relative group"
            >
              <div className="space-y-3">
                {/* Header tags */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      m.priority === 'P0' ? 'bg-red-950/80 text-red-400 border border-red-800' :
                      m.priority === 'P1' ? 'bg-amber-950/80 text-amber-400 border border-amber-800' :
                      'bg-zinc-800 text-zinc-300'
                    }`}>
                      {m.priority}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {m.category}
                    </span>
                  </div>

                  <select
                    value={m.status}
                    onChange={(e) => updateMission(m.id, { status: e.target.value as MissionStatus })}
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border focus:outline-none bg-zinc-900 ${
                      m.status === 'completed' ? 'text-emerald-400 border-emerald-800' : 'text-zinc-400 border-zinc-800'
                    }`}
                  >
                    <option value="in_progress">IN PROGRESS</option>
                    <option value="backlog">BACKLOG</option>
                    <option value="completed">COMPLETED</option>
                  </select>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-sm text-zinc-100">{m.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{m.description}</p>
                </div>

                {/* Definition of Done Checklist */}
                {m.definitionOfDone.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-zinc-900">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase">
                      <span>Definition of Done</span>
                      <span>{dodCompleted}/{dodTotal} ({dodPct}%)</span>
                    </div>
                    <div className="space-y-1">
                      {m.definitionOfDone.map(st => (
                        <div
                          key={st.id}
                          onClick={() => toggleSubtask(m.id, st.id)}
                          className="flex items-center gap-2 text-xs text-zinc-300 hover:text-white cursor-pointer"
                        >
                          {st.completed ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                          )}
                          <span className={st.completed ? 'line-through text-zinc-500' : ''}>{st.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Hours & Actions */}
              <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Est: {m.estimatedHours}h | Act: {m.actualHours}h</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenDeepWork}
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all"
                    title="Start Deep Work on this mission"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>

                  <button
                    onClick={() => deleteMission(m.id)}
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 transition-all"
                    title="Delete Mission"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Mission Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="font-bold text-base text-zinc-100">Create Weekly Mission</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMission} className="space-y-4 text-xs">
              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Mission Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Finish RTOS Synchronization Kernel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Description</label>
                <textarea
                  rows={2}
                  placeholder="Clear scope of work..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500 font-sans resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-zinc-400 uppercase text-[10px]">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="P0">P0 - Critical</option>
                    <option value="P1">P1 - High</option>
                    <option value="P2">P2 - Medium</option>
                    <option value="P3">P3 - Low</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-zinc-400 uppercase text-[10px]">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-zinc-400 uppercase text-[10px]">Estimated Hours</label>
                  <input
                    type="number"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-mono text-zinc-400 uppercase text-[10px]">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">
                  Definition of Done (1 item per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Item 1: Implement mutex lock&#10;Item 2: Priority Inheritance boost&#10;Item 3: Pass test suite"
                  value={dodText}
                  onChange={(e) => setDodText(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold"
                >
                  Create Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
