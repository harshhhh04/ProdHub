'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { InterviewQuestion } from '@/lib/types';
import { HelpCircle, Eye, EyeOff, RotateCw, CheckCircle, Star, X } from 'lucide-react';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({ isOpen, onClose }) => {
  const { interviewQuestions, updateInterviewQuestion } = useStore();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);

  if (!isOpen || interviewQuestions.length === 0) return null;

  const currentQ = interviewQuestions[currentIndex % interviewQuestions.length];

  const handleNext = () => {
    setIsAnswerRevealed(false);
    setCurrentIndex(prev => prev + 1);
  };

  const handleRateConfidence = (level: 1 | 2 | 3 | 4 | 5) => {
    updateInterviewQuestion(currentQ.id, {
      confidenceLevel: level,
      lastReviewed: new Date().toISOString()
    });
    handleNext();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-bold text-base text-zinc-100">Random Flashcard Drill</h2>
              <p className="text-[10px] font-mono text-zinc-400">
                Question { (currentIndex % interviewQuestions.length) + 1 } of { interviewQuestions.length }
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-amber-400 border border-zinc-800 font-bold uppercase">
            {currentQ.category}
          </span>
        </div>

        {/* Flashcard Body */}
        <div className="min-h-[220px] bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-2">
              INTERVIEW QUESTION {currentQ.company ? `• ${currentQ.company}` : ''}
            </span>
            <p className="text-sm font-semibold text-zinc-100 leading-relaxed font-sans">
              {currentQ.question}
            </p>
          </div>

          {/* Revealable Answer */}
          {isAnswerRevealed ? (
            <div className="pt-4 border-t border-zinc-800/80 space-y-2 animate-fadeIn">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider block">
                EXACT TECHNICAL ANSWER
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {currentQ.answer}
              </p>
            </div>
          ) : (
            <button
              onClick={() => setIsAnswerRevealed(true)}
              className="w-full py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all border border-zinc-700/50"
            >
              <Eye className="w-4 h-4" />
              <span>Reveal Answer</span>
            </button>
          )}
        </div>

        {/* Self-Rating Confidence Footer */}
        {isAnswerRevealed && (
          <div className="space-y-2 pt-2 border-t border-zinc-800 text-center">
            <span className="text-xs font-mono text-zinc-400 uppercase font-bold">
              Rate Your Confidence Level (1-5)
            </span>
            <div className="flex items-center justify-center gap-2">
              {([1, 2, 3, 4, 5] as (1 | 2 | 3 | 4 | 5)[]).map(num => (
                <button
                  key={num}
                  onClick={() => handleRateConfidence(num)}
                  className={`w-10 h-10 rounded-lg font-mono font-bold text-xs border transition-all ${
                    currentQ.confidenceLevel === num
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:bg-zinc-800"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Skip / Next Question</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-mono"
          >
            End Drill
          </button>
        </div>
      </div>
    </div>
  );
};
