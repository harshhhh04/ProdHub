'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { PlacementApplication } from '@/lib/types';
import { Briefcase, Calendar, ExternalLink, Plus, Trash2, Edit3, X, Building, CheckCircle, Clock } from 'lucide-react';

export const PlacementView: React.FC = () => {
  const { applications, addApplication, updateApplication, deleteApplication } = useStore();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<'Applied' | 'OA' | 'Interview' | 'Offer' | 'Rejected'>('Applied');
  const [salaryLocation, setSalaryLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [link, setLink] = useState('');
  const [oaDate, setOaDate] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;

    addApplication({
      company,
      role,
      status,
      salaryLocation,
      notes,
      link,
      oaDate: oaDate || undefined,
      interviewDate: interviewDate || undefined
    });

    setCompany('');
    setRole('');
    setSalaryLocation('');
    setNotes('');
    setLink('');
    setIsAddOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Placement Pipeline Tracker</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Monitor hardware & firmware engineering applications, OA countdowns, and technical interview stages.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Track New Company</span>
        </button>
      </div>

      {/* Pipeline Summary Counters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {['Applied', 'OA', 'Interview', 'Offer', 'Rejected'].map((st) => {
          const count = applications.filter(a => a.status === st).length;
          return (
            <div key={st} className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">{st}</span>
              <span className="text-xl font-mono font-bold text-zinc-100 mt-1">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Applications Table / Cards */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 font-mono text-xs text-zinc-400 flex items-center justify-between">
          <span>COMPANY & ROLE PIPELINE ({applications.length})</span>
          <span>ACTION & STAGE</span>
        </div>

        <div className="divide-y divide-zinc-900">
          {applications.map(a => (
            <div
              key={a.id}
              className="p-4 hover:bg-zinc-900/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-zinc-100">{a.company}</span>
                  <span className="text-xs text-zinc-400">• {a.role}</span>
                  {a.salaryLocation && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {a.salaryLocation}
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{a.notes}</p>

                <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 pt-1">
                  {a.interviewDate && (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Interview: {a.interviewDate}
                    </span>
                  )}
                  {a.oaDate && (
                    <span className="text-cyan-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> OA Date: {a.oaDate}
                    </span>
                  )}
                  {a.link && (
                    <a href={a.link} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Portal
                    </a>
                  )}
                </div>
              </div>

              {/* Status Switcher & Delete */}
              <div className="flex items-center gap-3 shrink-0">
                <select
                  value={a.status}
                  onChange={(e) => updateApplication(a.id, { status: e.target.value as any })}
                  className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border focus:outline-none bg-zinc-900 ${
                    a.status === 'Offer' ? 'text-emerald-400 border-emerald-800' :
                    a.status === 'Interview' ? 'text-amber-400 border-amber-800' :
                    a.status === 'OA' ? 'text-cyan-400 border-cyan-800' :
                    'text-zinc-300 border-zinc-800'
                  }`}
                >
                  <option value="Applied">Applied</option>
                  <option value="OA">OA Scheduled</option>
                  <option value="Interview">Interview Stage</option>
                  <option value="Offer">Offer Extended</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button
                  onClick={() => deleteApplication(a.id)}
                  className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Application Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="font-bold text-base text-zinc-100">Track Company Application</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateApp} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-zinc-400 uppercase text-[10px]">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Qualcomm, TI..."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-sans focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-mono text-zinc-400 uppercase text-[10px]">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Embedded Engineer..."
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-sans focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-zinc-400 uppercase text-[10px]">Pipeline Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Applied">Applied</option>
                    <option value="OA">OA Scheduled</option>
                    <option value="Interview">Interview Stage</option>
                    <option value="Offer">Offer Extended</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-zinc-400 uppercase text-[10px]">Salary / Location</label>
                  <input
                    type="text"
                    placeholder="Bangalore | ₹24 LPA"
                    value={salaryLocation}
                    onChange={(e) => setSalaryLocation(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-zinc-400 uppercase text-[10px]">OA Date (Optional)</label>
                  <input
                    type="date"
                    value={oaDate}
                    onChange={(e) => setOaDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-mono text-zinc-400 uppercase text-[10px]">Interview Date (Optional)</label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Application Link</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Notes & Preparation Focus</label>
                <textarea
                  rows={3}
                  placeholder="Specific topics requested, referral info..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-sans focus:outline-none focus:border-emerald-500 resize-none"
                />
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
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
