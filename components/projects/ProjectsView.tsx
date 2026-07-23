'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { Project } from '@/lib/types';
import { FolderGit2, CheckCircle2, Circle, ExternalLink, ArrowRight, Plus, X } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { projects, missions, updateProject, addProject } = useStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // New Project Form State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [category, setCategory] = useState<'core' | 'internship' | 'freelance' | 'portfolio'>('core');

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    addProject({
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      overview,
      status: 'active',
      goals: ['Define initial project scope'],
      milestones: [{ id: `m-${Date.now()}`, title: 'Setup base repository & architecture', completed: false }],
      resources: [],
      notes: '',
      progress: 10,
      category
    });
    setTitle('');
    setOverview('');
    setIsAddOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Projects Hub</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Long-term engineering initiatives, milestones, and dedicated project dashboards.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Main Grid: Left Projects List, Right Project Dashboard View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Project Cards */}
        <div className="space-y-3">
          {projects.map(p => {
            const isSelected = p.id === selectedProjectId || (!selectedProjectId && p.id === projects[0].id);
            const projectMissions = missions.filter(m => m.projectId === p.id);

            return (
              <div
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-zinc-900 border-cyan-500/60 shadow-lg shadow-cyan-500/5'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-cyan-400 border border-zinc-800 uppercase">
                      {p.category}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{p.status}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400">{p.progress}%</span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-zinc-100">{p.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5">{p.overview}</p>
                </div>

                <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${p.progress}%` }} />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1">
                  <span>{p.milestones.length} Milestones</span>
                  <span>{projectMissions.length} Related Missions</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Dashboard for Selected Project */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-xl space-y-6">
              {/* Project Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800 uppercase font-bold">
                      {selectedProject.category}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">ID: {selectedProject.slug}</span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-100">{selectedProject.title}</h2>
                  <p className="text-xs text-zinc-400 mt-1">{selectedProject.overview}</p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-mono font-bold text-cyan-400">{selectedProject.progress}%</div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Overall Progress</span>
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase">Project Core Goals</h3>
                <div className="space-y-1.5">
                  {selectedProject.goals.map((g, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase">Engineering Milestones</h3>
                <div className="space-y-2">
                  {selectedProject.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        const updatedMilestones = selectedProject.milestones.map(ms =>
                          ms.id === m.id ? { ...ms, completed: !ms.completed } : ms
                        );
                        const completedCount = updatedMilestones.filter(ms => ms.completed).length;
                        const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
                        updateProject(selectedProject.id, {
                          milestones: updatedMilestones,
                          progress: newProgress
                        });
                      }}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {m.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-600" />
                        )}
                        <span className={`text-xs ${m.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                          {m.title}
                        </span>
                      </div>
                      {m.targetDate && (
                        <span className="text-[10px] font-mono text-zinc-500">{m.targetDate}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources & Files */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase">Resources & References</h3>
                {selectedProject.resources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedProject.resources.map(r => (
                      <a
                        key={r.id}
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-cyan-400 hover:underline"
                      >
                        <span>{r.title}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 font-mono">No external resources attached yet.</p>
                )}
              </div>

              {/* Project Notes Scratchpad */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase">Architecture Notes</h3>
                <textarea
                  rows={4}
                  value={selectedProject.notes}
                  onChange={(e) => updateProject(selectedProject.id, { notes: e.target.value })}
                  placeholder="Record register maps, memory layouts, or design rationale..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-100 font-mono focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs border border-dashed border-zinc-800 rounded-xl">
              Select a project from the left panel to open its detailed dashboard.
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="font-bold text-base text-zinc-100">Create New Project</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sentinel Logging Engine"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Overview</label>
                <textarea
                  rows={2}
                  placeholder="Project goal and scope..."
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500 font-sans resize-none"
                />
              </div>

              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="core">Core Engineering</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                  <option value="portfolio">Portfolio</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
