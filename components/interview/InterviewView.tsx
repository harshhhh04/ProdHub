'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { InterviewQuestion } from '@/lib/types';
import { FlashcardModal } from './FlashcardModal';
import { HelpCircle, Shuffle, Plus, Star, Building, CheckCircle, X } from 'lucide-react';

export const InterviewView: React.FC = () => {
  const { interviewQuestions, addInterviewQuestion } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isFlashcardOpen, setIsFlashcardOpen] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  // Form State
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState<'Embedded C' | 'RTOS' | 'BLE' | 'Protocols' | 'Firmware Debugging' | 'Battery & Power' | 'Company Specific'>('RTOS');
  const [company, setCompany] = useState('');

  const categories = [
    'ALL',
    'Embedded C',
    'RTOS',
    'BLE',
    'Protocols',
    'Firmware Debugging',
    'Battery & Power',
    'Company Specific'
  ];

  const filteredQuestions = interviewQuestions.filter(q => {
    if (selectedCategory !== 'ALL' && q.category !== selectedCategory) return false;
    return true;
  });

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

    addInterviewQuestion({
      question,
      answer,
      category,
      company: company || undefined,
      confidenceLevel: 3,
      lastReviewed: new Date().toISOString()
    });

    setQuestion('');
    setAnswer('');
    setCompany('');
    setIsAddOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Interview Preparation</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Technical Q&A bank, company-specific questions, and confidence-rated flashcard drills.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFlashcardOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs shadow-lg shadow-amber-500/10 transition-all"
          >
            <Shuffle className="w-4 h-4" />
            <span>Random Flashcard Drill</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-mono hover:bg-zinc-800"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-amber-950/80 border-amber-500 text-amber-400 font-bold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredQuestions.map(q => (
          <div
            key={q.id}
            className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800 font-bold uppercase">
                  {q.category}
                </span>
                {q.company && (
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <Building className="w-3 h-3 text-zinc-500" />
                    {q.company}
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-sm text-zinc-100 font-sans leading-snug">{q.question}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
                {q.answer}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-xs font-mono text-zinc-500">
              <div className="flex items-center gap-1">
                <span>Confidence:</span>
                <span className="text-amber-400 font-bold">{q.confidenceLevel} / 5</span>
              </div>
              {q.lastReviewed && (
                <span>Reviewed {new Date(q.lastReviewed).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Flashcard Drill Modal */}
      <FlashcardModal isOpen={isFlashcardOpen} onClose={() => setIsFlashcardOpen(false)} />

      {/* New Question Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="font-bold text-base text-zinc-100">Add Interview Question</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-4 text-xs">
              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Question</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Compare SPI and I2C protocols..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-sans focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="font-mono text-zinc-400 uppercase text-[10px]">Model Technical Answer</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Exact concise answer..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-sans focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-zinc-400 uppercase text-[10px]">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  >
                    {categories.filter(c => c !== 'ALL').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-mono text-zinc-400 uppercase text-[10px]">Target Company (Optional)</label>
                  <input
                    type="text"
                    placeholder="Qualcomm, TI, ARM..."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
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
                  className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
