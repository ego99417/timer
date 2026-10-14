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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white/95 dark:bg-slate-900/95 rounded-3xl p-6 shadow-2xl border border-white/60 dark:border-slate-800 backdrop-blur-xl text-center relative overflow-hidden">
        {/* Background Sparkle Decor */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-300/20 dark:bg-pink-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-300/20 dark:bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Mascot Celebration Graphic */}
        <div className="w-32 h-32 mx-auto relative mb-2">
          <MascotDisplay
            state="COMPLETED"
            customImages={customImages}
            className="w-full h-full"
          />
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 dark:bg-pink-950/50 text-pink-500 rounded-full text-xs font-bold mb-2">
          <Sparkles size={13} />
          <span>오늘 근무 완료!</span>
        </div>

        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-1">
          수고 많으셨습니다 🎉
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
          목표 근무 시간을 모두 채웠어요!<br />
          이제 가벼운 마음으로 퇴근하세요 🏃💨
        </p>

        {/* Work Summary Card */}
        <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-left space-y-2 mb-4 text-xs">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock size={13} /> 오늘 순 근무 시간
            </span>
            <strong className="text-slate-800 dark:text-slate-100 font-bold font-mono text-sm">
              {summary.workedFormatted}
            </strong>
          </div>

          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} /> 출근 / 퇴근 시각
            </span>
            <span className="text-slate-700 dark:text-slate-200 font-medium">
              {summary.clockInTime} ~ {summary.clockOutTime}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" /> 오늘 목표 달성률
            </span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
              {summary.completionRate}%
            </strong>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onViewStats && (
            <button
              onClick={() => {
                soundManager.playClick();
                onViewStats();
              }}
              className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              주간 통계 보기
            </button>
          )}
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="flex-1 py-2.5 text-xs font-bold bg-pink-500 hover:bg-pink-600 active:scale-95 text-white rounded-xl shadow-md transition-all"
          >
            확인 및 퇴근하기
          </button>
        </div>
      </div>
    </div>
  );
}
