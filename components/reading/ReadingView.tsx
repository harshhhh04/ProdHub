'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { Book } from '@/lib/types';
import { BookMarked, Lightbulb, Quote, CheckCircle, Plus, X } from 'lucide-react';

export const ReadingView: React.FC = () => {
  const { books, updateBook, addBook } = useStore();
  const [selectedBookId, setSelectedBookId] = useState<string | null>(books[0]?.id || null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState(300);

  const selectedBook = books.find(b => b.id === selectedBookId) || books[0];

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) return;

    addBook({
      title,
      author,
      progressPercent: 0,
      readPages: 0,
      totalPages: Number(totalPages),
      status: 'reading',
      keyIdeas: ['First reading note...'],
      quotes: [],
      actionableLessons: []
    });

    setTitle('');
    setAuthor('');
    setIsAddOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Engineering Reading & Idea Vault</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Idea-first book vault. Extract actionable lessons and attach them to projects or firmware architectures.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-400 text-black font-semibold text-xs font-mono transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Book</span>
        </button>
      </div>

      {/* Grid: Books List & Idea Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Book Cards */}
        <div className="space-y-3">
          {books.map(b => {
            const isSelected = selectedBook?.id === b.id;
            return (
              <div
                key={b.id}
                onClick={() => setSelectedBookId(b.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-zinc-900 border-indigo-500/60 shadow-lg shadow-indigo-500/5'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-indigo-400 border border-zinc-800 uppercase font-bold">
                    {b.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-400">{b.progressPercent}%</span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-zinc-100">{b.title}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">by {b.author}</p>
                </div>

                <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${b.progressPercent}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Ideas & Actionable Lessons */}
        <div className="lg:col-span-2">
          {selectedBook ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Book Overview</span>
                  <h2 className="text-xl font-bold text-zinc-100">{selectedBook.title}</h2>
                  <p className="text-xs text-zinc-400">by {selectedBook.author}</p>
                </div>

                <div className="w-48 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                    <span>Progress</span>
                    <span>{selectedBook.progressPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedBook.progressPercent}
                    onChange={(e) => updateBook(selectedBook.id, { progressPercent: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Key Ideas */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h3 className="font-mono font-bold text-xs text-zinc-200 uppercase">
                    Key Ideas ({selectedBook.keyIdeas.length})
                  </h3>
                </div>

                <div className="space-y-2">
                  {selectedBook.keyIdeas.map((idea, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-200 leading-relaxed font-sans">
                      • {idea}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quotes */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Quote className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-mono font-bold text-xs text-zinc-200 uppercase">
                    Memorable Quotes
                  </h3>
                </div>

                <div className="space-y-2">
                  {selectedBook.quotes.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-300 italic font-mono">
                      {q}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Lessons */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-mono font-bold text-xs text-zinc-200 uppercase">
                    Actionable Lessons for Engineering Projects
                  </h3>
                </div>

                <div className="space-y-2">
                  {selectedBook.actionableLessons.map((al, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-300 font-sans">
                      ✓ {al}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs border border-dashed border-zinc-800 rounded-xl">
              Select a book to view extracted ideas and actionable lessons.
            </div>
          )}
        </div>
      </div>

      {/* New Book Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="font-bold text-base text-zinc-100">Add Book to Vault</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-4 text-xs">
              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="Making Embedded Systems"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-sans focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Author</label>
                <input
                  type="text"
                  required
                  placeholder="Elecia White"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-sans focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Total Pages</label>
                <input
                  type="number"
                  value={totalPages}
                  onChange={(e) => setTotalPages(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-indigo-500"
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
                  className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-400 text-black font-mono font-bold"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
