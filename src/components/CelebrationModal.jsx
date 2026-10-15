import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, Clock, Calendar, Heart } from 'lucide-react';
import MascotDisplay from './MascotDisplay';
import { soundManager } from '../utils/audio';

export default function CelebrationModal({
  summary,
  customImages,
  onClose,
  onViewStats,
}) {
  useEffect(() => {
    // Fire confetti cannon!
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    } catch {
      // Ignored
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 bg-black/40 dark:bg-black/60 rounded-[28px] overflow-hidden animate-fadeIn">
      <div className="w-full max-w-[365px] max-h-[365px] bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-md border border-slate-200/90 dark:border-slate-700/80 text-center relative overflow-hidden flex flex-col">
        {/* Background Sparkle Decor */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-300/20 dark:bg-pink-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-300/20 dark:bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex-1 min-h-0 overflow-y-auto pr-0.5">
          {/* Mascot Celebration Graphic */}
          <div className="w-20 h-20 mx-auto relative mb-1">
            <MascotDisplay
              state="COMPLETED"
              customImages={customImages}
              className="w-full h-full"
            />
          </div>

          {/* Title */}
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-pink-50 dark:bg-pink-950/50 text-pink-500 rounded-full text-[11px] font-bold mb-1">
            <Sparkles size={11} />
            <span>오늘 근무 완료!</span>
          </div>

          <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-0.5">
            수고 많으셨습니다 🎉
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-tight">
            목표 근무 시간을 모두 채웠어요! 이제 칼퇴하세요 🏃💨
          </p>

          {/* Work Summary Card */}
          <div className="p-2.5 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-left space-y-1.5 mb-2 text-xs">
            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-[11px]">
                <Clock size={12} /> 순 근무 시간
              </span>
              <strong className="text-slate-800 dark:text-slate-100 font-bold font-mono text-xs">
                {summary.workedFormatted}
              </strong>
            </div>

            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-[11px]">
                <Calendar size={12} /> 출퇴근 시각
              </span>
              <span className="text-slate-700 dark:text-slate-200 font-medium text-[11px]">
                {summary.clockInTime} ~ {summary.clockOutTime}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-[11px]">
                <CheckCircle2 size={12} className="text-emerald-500" /> 오늘 달성률
              </span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                {summary.completionRate}%
              </strong>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 shrink-0">
          {onViewStats && (
            <button
              onClick={() => {
                soundManager.playClick();
                onViewStats();
              }}
              className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              주간 통계
            </button>
          )}
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="flex-1 py-1.5 text-xs font-bold bg-pink-500 hover:bg-pink-600 active:scale-95 text-white rounded-lg shadow-sm transition-all"
          >
            확인 및 퇴근하기
          </button>
        </div>
      </div>
    </div>
  );
}
