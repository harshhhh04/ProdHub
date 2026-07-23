'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store/useStore';
import { Play, Pause, RotateCcw, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react';

interface DeepWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeepWorkModal: React.FC<DeepWorkModalProps> = ({ isOpen, onClose }) => {
  const { missions, addDeepWorkSession } = useStore();
  
  const [selectedDuration, setSelectedDuration] = useState<number>(90); // 90 min default
  const [selectedMissionId, setSelectedMissionId] = useState<string>('');
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(90 * 60);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  
  // Post-session form
  const [accomplishments, setAccomplishments] = useState<string>('');
  const [interruptions, setInterruptions] = useState<number>(0);

  // Synchronize duration change
  const handleSelectDuration = (mins: number) => {
    setSelectedDuration(mins);
    if (!isTimerRunning) {
      setSecondsRemaining(mins * 60);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setIsFinished(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const selectedMission = missions.find(m => m.id === selectedMissionId);

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    addDeepWorkSession({
      missionId: selectedMissionId || undefined,
      missionTitle: selectedMission ? selectedMission.title : 'General Deep Work Focus',
      durationMinutes: selectedDuration,
      accomplishments: accomplishments || 'Completed planned deep work session',
      interruptions: Number(interruptions)
    });
    // Reset modal state
    setIsFinished(false);
    setIsTimerRunning(false);
    setSecondsRemaining(selectedDuration * 60);
    setAccomplishments('');
    setInterruptions(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {!isFinished ? (
          <div className="flex flex-col items-center text-center space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-mono font-semibold mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>DEEP WORK PROTOCOL</span>
              </div>
              <h2 className="text-xl font-bold text-zinc-100">Focused Execution Session</h2>
              <p className="text-xs text-zinc-400 mt-1">Zero distractions. High cognitive throughput.</p>
            </div>

            {/* Mission Selector */}
            <div className="w-full text-left space-y-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase">Target Mission</label>
              <select
                value={selectedMissionId}
                onChange={(e) => setSelectedMissionId(e.target.value)}
                disabled={isTimerRunning}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="">-- General Deep Work Focus --</option>
                {missions.map(m => (
                  <option key={m.id} value={m.id}>
                    [{m.priority}] [{m.category}] {m.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Presets */}
            <div className="flex gap-2 w-full">
              {[45, 60, 90, 120].map(mins => (
                <button
                  key={mins}
                  onClick={() => handleSelectDuration(mins)}
                  disabled={isTimerRunning}
                  className={`flex-1 py-2 rounded-lg font-mono text-xs font-semibold border transition-all ${
                    selectedDuration === mins
                      ? 'bg-emerald-500 text-black border-emerald-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            {/* Large Timer Display */}
            <div className="py-6 px-8 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 w-full flex flex-col items-center justify-center">
              <span className="font-mono text-6xl font-bold tracking-wider text-emerald-400 font-mono">
                {formattedTime}
              </span>
              {selectedMission && (
                <p className="text-xs text-zinc-400 mt-2 font-mono truncate max-w-xs">
                  Mission: {selectedMission.title}
                </p>
              )}
            </div>

            {/* Timer Action Controls */}
            <div className="flex items-center gap-3 w-full">
              {!isTimerRunning ? (
                <button
                  onClick={() => setIsTimerRunning(true)}
                  className="flex-1 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 transition-all"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Start Session</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsTimerRunning(false)}
                  className="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Pause className="w-4 h-4 fill-black" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setSecondsRemaining(selectedDuration * 60);
                }}
                className="px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setIsFinished(true);
                }}
                className="px-4 py-3 rounded-lg bg-zinc-800 text-emerald-400 font-mono text-xs font-semibold hover:bg-zinc-700 transition-all"
              >
                Finish Early
              </button>
            </div>
          </div>
        ) : (
          /* Post Session Accomplishment Review Form */
          <form onSubmit={handleSaveSession} className="space-y-5">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="font-bold text-lg text-zinc-100">Session Complete!</h3>
                <p className="text-xs text-zinc-400">{selectedDuration} Minutes Recorded</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-300 font-semibold uppercase">
                What did you accomplish during this session?
              </label>
              <textarea
                required
                rows={3}
                placeholder="E.g., Debugged Priority Inversion PendSV context switch fault, passed 4 unit tests."
                value={accomplishments}
                onChange={(e) => setAccomplishments(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-sans resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-300 font-semibold uppercase flex items-center justify-between">
                <span>Number of Interruptions</span>
                <span className="text-zinc-500 font-normal">Phone calls, notifications, context breaks</span>
              </label>
              <div className="flex items-center gap-3">
                {[0, 1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setInterruptions(num)}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                      interruptions === num
                        ? 'bg-amber-500 text-black border-amber-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider font-mono transition-all"
              >
                Log Session & Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
