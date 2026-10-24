/**
 * @file src/components/CircularTimer.jsx
 * @description 원형 프로그레스 바 타이머 컴포넌트
 * 
 * [주요 역할]
 * - SVG 원형 링(Circle Ring)을 통해 목표 시간 대비 근무 진행률(%) 시각화
 * - 중앙에 마스코트 캐릭터(MascotDisplay)를 품고 있는 메인 비주얼 영역
 * - 남은 시간 및 퇴근 예정 시각 텍스트 렌더링
 */

import React from 'react';
import MascotDisplay from './MascotDisplay';
import { soundManager } from '../utils/audio';

export default function CircularTimer({
  timerState,
  remainingSeconds,
  totalTargetSeconds,
  customImages,
  pomodoroEnabled,
  currentCycle,
  totalCycles,
  isRestPeriod,
}) {
  // Calculate progress percentage
  const elapsed = Math.max(0, totalTargetSeconds - remainingSeconds);
  const progressPercent = totalTargetSeconds > 0 ? Math.min(100, (elapsed / totalTargetSeconds) * 100) : 0;

  // SVG Ring calculations
  const size = 140;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Format HH:MM:SS
  const formatTime = (totalSec) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = Math.floor(totalSec % 60);
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // State Badge info
  const getStateBadge = () => {
    switch (timerState) {
      case 'FOCUS':
        return {
          text: '근무 중',
          sub: '열심히 집중하는 중 🔥',
          bg: 'bg-emerald-50 dark:bg-emerald-950/60',
          textCol: 'text-emerald-600 dark:text-emerald-400',
          borderCol: 'border-emerald-200 dark:border-emerald-800/60',
          dotCol: 'bg-emerald-500 animate-pulse',
        };
      case 'REST':
        return {
          text: '점심 · 휴식',
          sub: '든든하게 재충전하세요 ☕',
          bg: 'bg-amber-50 dark:bg-amber-950/60',
          textCol: 'text-amber-600 dark:text-amber-400',
          borderCol: 'border-amber-200 dark:border-amber-800/60',
          dotCol: 'bg-amber-500',
        };
      case 'PAUSED':
        return {
          text: '일시정지',
          sub: '잠시 쉬어가는 중 ⏸️',
          bg: 'bg-indigo-50 dark:bg-indigo-950/60',
          textCol: 'text-indigo-600 dark:text-indigo-400',
          borderCol: 'border-indigo-200 dark:border-indigo-800/60',
          dotCol: 'bg-indigo-400',
        };
      case 'COMPLETED':
        return {
          text: '퇴근 완료 🎉',
          sub: '오늘 하루도 수고 많으셨어요!',
          bg: 'bg-pink-50 dark:bg-pink-950/60',
          textCol: 'text-pink-600 dark:text-pink-400',
          borderCol: 'border-pink-200 dark:border-pink-800/60',
          dotCol: 'bg-pink-500',
        };
      default:
        return {
          text: '출근 전',
          sub: '출근 버튼을 눌러 시작하세요 🌱',
          bg: 'bg-slate-50 dark:bg-slate-800',
          textCol: 'text-slate-500 dark:text-slate-400',
          borderCol: 'border-slate-200 dark:border-slate-700',
          dotCol: 'bg-slate-400',
        };
    }
  };

  const badge = getStateBadge();

  // Ring gradient colors based on state
  const getGradientColors = () => {
    if (timerState === 'REST') return { start: '#F59E0B', stop: '#FBBF24' };
    if (timerState === 'PAUSED') return { start: '#818CF8', stop: '#A78BFA' };
    if (timerState === 'COMPLETED') return { start: '#EC4899', stop: '#F43F5E' };
    return { start: '#10B981', stop: '#34D399' }; // FOCUS
  };

  const ringGrad = getGradientColors();

  return (
    <div className="flex flex-col items-center justify-center">
      {/* State Badge */}
      <div
        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10.5px] font-bold transition-all shadow-2xs mb-1 ${badge.bg} ${badge.textCol} ${badge.borderCol}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${badge.dotCol}`} />
        <span>{badge.text}</span>
      </div>

      {/* Circular Progress Ring */}
      <div className="relative w-[140px] h-[140px] flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform">
          <defs>
            <linearGradient id="timerRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ringGrad.start} />
              <stop offset="100%" stopColor={ringGrad.stop} />
            </linearGradient>
            <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />

          {/* Progress Animated Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#timerRingGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            filter="url(#ringGlow)"
          />
        </svg>

        {/* Inner Mascot Display with Soft Breathing Animation */}
        <div
          onClick={() => soundManager.playClick()}
          className="absolute inset-[10px] rounded-full flex items-center justify-center cursor-pointer p-0.5 hover:scale-105 active:scale-95 transition-transform"
          title="귀여운 뽀송이 터치!"
        >
          <div className="w-full h-full animate-soft-bounce flex items-center justify-center">
            <MascotDisplay
              state={timerState}
              customImages={customImages}
              progressPercent={progressPercent}
              className="w-20 h-20"
            />
          </div>
        </div>
      </div>

      {/* Countdown Digital Timer */}
      <div className="mt-0.5 text-center">
        <div className="text-xl font-black tracking-tight font-mono text-slate-800 dark:text-slate-100 select-all drop-shadow-2xs leading-tight">
          {formatTime(remainingSeconds)}
        </div>
        <div className="text-[9.5px] font-medium text-slate-400 mt-0.5">
          {customImages?.mode === 'growth' ? (
            <span className="text-pink-600 dark:text-pink-400 font-semibold">
              {progressPercent >= 100 || timerState === 'COMPLETED'
                ? 'Lv.6 퇴근 달성! 🎉'
                : progressPercent >= 85
                ? 'Lv.5 프로 마스터 🔥'
                : progressPercent >= 60
                ? 'Lv.4 열일 직장인 💻'
                : progressPercent >= 35
                ? 'Lv.3 성장기 🎒'
                : progressPercent >= 15
                ? 'Lv.2 아기 다람쥐 🍼'
                : 'Lv.1 알 단계 🌱'}
            </span>
          ) : (
            badge.sub
          )}
        </div>
      </div>

      {/* Progress Dots (Pomodoro / Routine Cycles) */}
      {pomodoroEnabled ? (
        <div className="flex items-center gap-2 mt-2.5 px-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-200/50 dark:border-slate-700/50">
          <span className="text-[10px] font-bold text-slate-400">
            주기 {currentCycle}/{totalCycles}
          </span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalCycles }).map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx < currentCycle - 1
                    ? 'bg-emerald-500'
                    : idx === currentCycle - 1
                    ? isRestPeriod
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-emerald-500 animate-pulse'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Progress completion percentage indicator */
        <div className="flex items-center gap-1.5 mt-2 px-2.5 py-0.5 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-200/50 dark:border-slate-700/50">
          <span className="text-[10px] font-semibold text-slate-400">
            진행률: <strong className="text-indigo-600 dark:text-indigo-400">{Math.round(progressPercent)}%</strong>
          </span>
        </div>
      )}
    </div>
  );
}
