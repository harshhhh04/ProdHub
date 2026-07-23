'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { KnowledgeNote } from '@/lib/types';
import { BookOpen, Search, Tag, Plus, Edit3, Trash2, Code, Copy, Check, X } from 'lucide-react';

export const KnowledgeView: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('RTOS');
  const [content, setContent] = useState('');
  const [tagsStr, setTagsStr] = useState('');

  const [copiedCode, setCopiedCode] = useState(false);

  const categories = [
    'ALL',
    'RTOS',
    'BLE',
    'Embedded C',
    'Power Management',
    'Battery',
    'Firmware',
    'Debugging',
    'Interview Questions',
    'Sentinel',
    'SAP',
    'Book Notes',
    'Random Ideas'
  ];

  const filteredNotes = notes.filter(n => {
    if (selectedCategory !== 'ALL' && n.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const activeNote = notes.find(n => n.id === selectedNoteId) || filteredNotes[0];

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    addNote({
      title,
      category,
      content: content || '# ' + title + '\n\nAdd engineering notes here...',
      tags,
      backlinks: []
    });

    setTitle('');
    setContent('');
    setTagsStr('');
    setIsAddOpen(false);
  };

  const handleCopy = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Knowledge Vault</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Searchable engineering second brain. Code snippets, memory maps, protocol specs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-cyan-500 w-48 md:w-64"
            />
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-400 font-bold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vault Grid: Note List (1/3), Note Renderer/Editor (2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Notes List */}
        <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
          {filteredNotes.map(n => {
            const isSelected = activeNote?.id === n.id;
            return (
              <div
                key={n.id}
                onClick={() => {
                  setSelectedNoteId(n.id);
                  setIsEditing(false);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-zinc-900 border-cyan-500/60 shadow-lg shadow-cyan-500/5'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-cyan-400 border border-zinc-800 font-bold">
                    {n.category}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {new Date(n.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-xs text-zinc-100">{n.title}</h3>

                {n.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {n.tags.map(t => (
                      <span key={t} className="text-[9px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Note Viewer & Editor */}
        <div className="lg:col-span-2">
          {activeNote ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-xl space-y-5">
              {/* Note Header Controls */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800 font-bold uppercase">
                      {activeNote.category}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      Updated {new Date(activeNote.updatedAt).toLocaleString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-100">{activeNote.title}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono hover:bg-zinc-800"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isEditing ? 'Preview' : 'Edit Note'}</span>
                  </button>

                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Note Content (Viewer or Editor) */}
              {!isEditing ? (
                <div className="space-y-4">
                  {/* Rendered Note Content */}
                  <div className="prose prose-invert max-w-none text-xs text-zinc-300 space-y-3 font-sans leading-relaxed whitespace-pre-wrap">
                    {activeNote.content}
                  </div>

                  {/* Code snippet quick copy helper */}
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Code className="w-4 h-4 text-cyan-400" />
                      <span>Code & Formula Block Quick Copy</span>
                    </div>
                    <button
                      onClick={() => handleCopy(activeNote.content)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-400 transition-colors"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied!' : 'Copy Snippet'}</span>
                    </button>
                  </div>

                  {/* Tags & Backlinks */}
                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Tag className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Tags:</span>
                      {activeNote.tags.map(t => (
                        <span key={t} className="bg-zinc-900 text-cyan-300 px-2 py-0.5 rounded text-[10px] border border-zinc-800">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Note Editor Form */
                <div className="space-y-4">
                  <textarea
                    rows={16}
                    value={activeNote.content}
                    onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-100 font-mono focus:outline-none focus:border-cyan-500 leading-relaxed resize-y"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-cyan-500 text-black font-mono font-bold text-xs rounded hover:bg-cyan-400"
                    >
                      Done Editing
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs border border-dashed border-zinc-800 rounded-xl">
              No notes match your category/search criteria. Create a new note to start building your second brain.
            </div>
          )}
        </div>
      </div>

      {/* New Note Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-full max-w-lg shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="font-bold text-base text-zinc-100">Create Knowledge Note</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Note Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ARM Cortex-M NVIC Interrupt Priorities"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-cyan-500"
                >
                  {categories.filter(c => c !== 'ALL').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="RTOS, Mutex, ARM, Interview"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Initial Markdown Content</label>
                <textarea
                  rows={6}
                  placeholder="# Summary&#10;&#10;Key technical points..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-cyan-500 resize-none"
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
                  className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
