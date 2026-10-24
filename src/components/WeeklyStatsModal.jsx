/**
 * @file src/components/WeeklyStatsModal.jsx
 * @description 주간 근무 통계 모달
 * 
 * [주요 역할]
 * - 월~일 요일별 실제 근무 시간과 목표 시간 시각화 (막대 차트)
 * - 이번 주 총 근무 시간 및 주간 목표 달성률 계산
 */

import React from 'react';
import { BarChart3, TrendingUp, Calendar, Clock, CheckCircle, RotateCcw } from 'lucide-react';

export default function WeeklyStatsModal({ weeklyData, weekdayHours, onReset, onClose }) {
  const days = [
    { key: 'mon', label: '월' },
    { key: 'tue', label: '화' },
    { key: 'wed', label: '수' },
    { key: 'thu', label: '목' },
    { key: 'fri', label: '금' },
    { key: 'sat', label: '토' },
    { key: 'sun', label: '일' },
  ];

  // Calculate totals
  const totalTargetMinutes = days.reduce((acc, d) => acc + (weekdayHours[d.key] || 0) * 60, 0);
  const totalWorkedMinutes = days.reduce((acc, d) => acc + (weeklyData[d.key] || 0), 0);

  const formatHoursMinutes = (totalMinutes) => {
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    return `${h}시간 ${m}분`;
  };

  const weeklyRate = totalTargetMinutes > 0 ? Math.min(100, Math.round((totalWorkedMinutes / totalTargetMinutes) * 100)) : 0;

  const handleReset = () => {
    if (window.confirm('이번 주 근무 기록을 모두 0분으로 초기화할까요?')) {
      if (onReset) onReset();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 bg-black/40 dark:bg-black/60 rounded-[28px] overflow-hidden animate-fadeIn">
      <div className="w-full max-w-[375px] max-h-[365px] bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-md border border-slate-200/90 dark:border-slate-700/80 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-500 flex items-center justify-center">
              <BarChart3 size={16} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">이번 주 근무 통계</h3>
              <p className="text-[10px] text-slate-400">요일별 목표 대비 실제 근무 현황</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-2 py-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            닫기
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2.5 my-2">
          {/* Weekly Summary Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-violet-50/60 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 rounded-xl">
              <div className="flex items-center gap-1 text-[11px] text-violet-600 dark:text-violet-300 font-medium">
                <Clock size={12} />
                총 누적 근무
              </div>
              <div className="text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {formatHoursMinutes(totalWorkedMinutes)}
              </div>
              <div className="text-[10px] text-slate-400">
                목표 {formatHoursMinutes(totalTargetMinutes)}
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl">
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-300 font-medium">
                <TrendingUp size={12} />
                주간 달성률
              </div>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {weeklyRate}%
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {weeklyRate >= 100 ? '목표 달성 🎉' : `${formatHoursMinutes(Math.max(0, totalTargetMinutes - totalWorkedMinutes))} 남음`}
              </div>
            </div>
          </div>

          {/* Bar Chart Breakdown */}
          <div className="space-y-2">
            {days.map((d) => {
              const targetMin = (weekdayHours[d.key] || 0) * 60;
              const workedMin = weeklyData[d.key] || 0;
              const percent = targetMin > 0 ? Math.min(100, Math.round((workedMin / targetMin) * 100)) : (workedMin > 0 ? 100 : 0);
              const isCompleted = targetMin > 0 && workedMin >= targetMin;

              return (
                <div key={d.key} className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 font-bold text-[11px] text-slate-600 dark:text-slate-300">{d.label}</span>
                      <span className="text-[10px] text-slate-400">
                        {targetMin > 0 ? `목표 ${(weekdayHours[d.key] || 0)}h` : '휴무'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {formatHoursMinutes(workedMin)}
                      </span>
                      {isCompleted && (
                        <CheckCircle size={11} className="text-emerald-500" />
                      )}
                    </div>
                  </div>

                  {/* Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : percent > 50
                          ? 'bg-violet-500'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 px-1">
          <p className="text-[10px] text-slate-400">
            📊 요일별 근무 기록은 로컬에 안전하게 보관됩니다.
          </p>
          {onReset && (
            <button
              onClick={handleReset}
              className="text-[10px] text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40"
              title="이번 주 기록 0분으로 초기화"
            >
              <RotateCcw size={10} />
              <span>초기화</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
