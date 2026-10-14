import React from 'react';
import {
  Clock,
  Sparkles,
  ListTodo,
  Award,
  BarChart3,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function DockBar({
  dockSlots = [],
  timerState,
  remainingSeconds,
  todoCount,
  openModal,
  activeModal,
}) {
  // If no dock slots selected, render nothing
  if (!dockSlots || dockSlots.length === 0) {
    return null;
  }

  const formatDockTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = Math.floor(totalSeconds % 60);
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const remM = m % 60;
      return `${h}h${remM}m`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isRunning = timerState === 'FOCUS' || timerState === 'REST';

  const renderSlotButton = (slotKey) => {
    switch (slotKey) {
      case 'timer':
        return (
          <button
            key="timer"
            onClick={() => {
              soundManager.playClick();
              // Scroll/focus timer or toggle active modal
            }}
            className="group relative flex flex-col items-center justify-center w-11 h-12 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all active:scale-95"
            title="타이머 상태"
          >
            {/* Status indicator dot */}
            <div className="relative flex items-center justify-center">
              <span
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  isRunning
                    ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]'
                    : timerState === 'PAUSED'
                    ? 'bg-amber-400'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
              {isRunning && (
                <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
              )}
            </div>
            <Clock size={15} className="mt-0.5 text-slate-600 dark:text-slate-300 group-hover:text-indigo-500 transition-colors" />
            <span className="text-[8.5px] font-bold mt-0.5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600">
              {formatDockTime(remainingSeconds)}
            </span>
          </button>
        );

      case 'mascot':
        return (
          <button
            key="mascot"
            onClick={() => {
              soundManager.playClick();
              openModal(activeModal === 'mascot' ? null : 'mascot');
            }}
            className={`group relative flex flex-col items-center justify-center w-11 h-11 rounded-xl border transition-all active:scale-95 ${
              activeModal === 'mascot'
                ? 'bg-pink-50 dark:bg-pink-950/50 border-pink-300 dark:border-pink-800 text-pink-600 dark:text-pink-300 shadow-sm'
                : 'bg-white/70 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-pink-500 hover:shadow-md'
            }`}
            title="캐릭터 / 이미지 관리"
          >
            <Sparkles size={16} className="group-hover:scale-110 transition-transform" />
            <span className="text-[8.5px] font-semibold mt-0.5">캐릭터</span>
          </button>
        );

      case 'todo':
        return (
          <button
            key="todo"
            onClick={() => {
              soundManager.playClick();
              openModal(activeModal === 'todo' ? null : 'todo');
            }}
            className={`group relative flex flex-col items-center justify-center w-11 h-11 rounded-xl border transition-all active:scale-95 ${
              activeModal === 'todo'
                ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'bg-white/70 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-500 hover:shadow-md'
            }`}
            title="오늘의 할 일 (Todo)"
          >
            <ListTodo size={16} className="group-hover:scale-110 transition-transform" />
            <span className="text-[8.5px] font-semibold mt-0.5">할 일</span>
            {todoCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {todoCount > 9 ? '9+' : todoCount}
              </span>
            )}
          </button>
        );

      case 'achievements':
        return (
          <button
            key="achievements"
            onClick={() => {
              soundManager.playClick();
              openModal(activeModal === 'achievements' ? null : 'achievements');
            }}
            className={`group relative flex flex-col items-center justify-center w-11 h-11 rounded-xl border transition-all active:scale-95 ${
              activeModal === 'achievements'
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-300 shadow-sm'
                : 'bg-white/70 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-amber-500 hover:shadow-md'
            }`}
            title="업적 및 배지"
          >
            <Award size={16} className="group-hover:scale-110 transition-transform" />
            <span className="text-[8.5px] font-semibold mt-0.5">업적</span>
          </button>
        );

      case 'stats':
        return (
          <button
            key="stats"
            onClick={() => {
              soundManager.playClick();
              openModal(activeModal === 'stats' ? null : 'stats');
            }}
            className={`group relative flex flex-col items-center justify-center w-11 h-11 rounded-xl border transition-all active:scale-95 ${
              activeModal === 'stats'
                ? 'bg-violet-50 dark:bg-violet-950/50 border-violet-300 dark:border-violet-800 text-violet-600 dark:text-violet-300 shadow-sm'
                : 'bg-white/70 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-violet-500 hover:shadow-md'
            }`}
            title="이번 주 근무 통계"
          >
            <BarChart3 size={16} className="group-hover:scale-110 transition-transform" />
            <span className="text-[8.5px] font-semibold mt-0.5">통계</span>
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <aside className="flex flex-col items-center gap-1.5 py-2 px-1.5 bg-white/40 dark:bg-slate-900/40 rounded-xl border border-white/50 dark:border-slate-800/60 backdrop-blur-md shrink-0">
      {dockSlots.map((slot) => renderSlotButton(slot))}
    </aside>
  );
}
