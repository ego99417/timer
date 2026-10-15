import React from 'react';
import { Play, Pause, Square, Maximize2, Coffee } from 'lucide-react';
import MascotDisplay from './MascotDisplay';
import { soundManager } from '../utils/audio';

export default function MiniModeBar({
  timerState,
  remainingSeconds,
  customImages,
  progressPercent = 0,
  onPlayResume,
  onPause,
  onClockOut,
  onExpand,
}) {
  const formatTime = (totalSec) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = Math.floor(totalSec % 60);
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isRunning = timerState === 'FOCUS' || timerState === 'REST';

  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-md transition-all app-drag cursor-move select-none">
      {/* Mini Mascot Thumbnail */}
      <div className="relative w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
        <MascotDisplay
          state={timerState}
          customImages={customImages}
          progressPercent={progressPercent}
          className="w-full h-full"
        />
        {/* Status indicator dot */}
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
            timerState === 'FOCUS'
              ? 'bg-emerald-500 animate-pulse'
              : timerState === 'REST'
              ? 'bg-amber-400'
              : timerState === 'PAUSED'
              ? 'bg-indigo-400'
              : 'bg-rose-400'
          }`}
        />
      </div>

      {/* Countdown and State */}
      <div className="flex flex-col min-w-[70px]">
        <span className="font-mono font-extrabold text-base text-slate-800 dark:text-slate-100 tracking-tight leading-none">
          {formatTime(remainingSeconds)}
        </span>
        <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
          {timerState === 'FOCUS'
            ? '근무 중'
            : timerState === 'REST'
            ? '휴식·점심'
            : timerState === 'PAUSED'
            ? '일시정지'
            : '퇴근완료'}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {isRunning ? (
          <button
            onClick={() => {
              soundManager.playClick();
              onPause();
            }}
            className="w-7 h-7 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center active:scale-95 transition-all shadow-xs"
            title="일시정지"
          >
            <Pause size={13} />
          </button>
        ) : (
          <button
            onClick={() => {
              soundManager.playClockIn();
              onPlayResume();
            }}
            className="w-7 h-7 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center active:scale-95 transition-all shadow-xs"
            title="시작 / 재개"
          >
            <Play size={13} className="ml-0.5" />
          </button>
        )}

        <button
          onClick={() => {
            soundManager.playClick();
            onClockOut();
          }}
          className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/40 flex items-center justify-center active:scale-95 transition-all"
          title="퇴근 처리"
        >
          <Square size={12} />
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onExpand();
          }}
          className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 flex items-center justify-center active:scale-95 transition-all"
          title="일반 뷰로 확대"
        >
          <Maximize2 size={12} />
        </button>
      </div>
    </div>
  );
}
