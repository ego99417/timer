import React from 'react';
import { BarChart3, TrendingUp, Calendar, Clock, CheckCircle } from 'lucide-react';

export default function WeeklyStatsModal({ weeklyData, weekdayHours, onClose }) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 rounded-3xl p-5 shadow-2xl border border-white/60 dark:border-slate-800 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-500 flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">이번 주 근무 통계</h3>
              <p className="text-[11px] text-slate-400">요일별 목표 대비 실제 근무 현황</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            닫기
          </button>
        </div>

        {/* Weekly Summary Cards */}
        <div className="grid grid-cols-2 gap-2.5 my-3.5">
          <div className="p-3 bg-violet-50/60 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-300 font-medium">
              <Clock size={13} />
              총 누적 근무
            </div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
              {formatHoursMinutes(totalWorkedMinutes)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              목표 {formatHoursMinutes(totalTargetMinutes)}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-300 font-medium">
              <TrendingUp size={13} />
              주간 달성률
            </div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {weeklyRate}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {weeklyRate >= 100 ? '목표 초과 달성 🎉' : `${formatHoursMinutes(Math.max(0, totalTargetMinutes - totalWorkedMinutes))} 남음`}
            </div>
          </div>
        </div>

        {/* Bar Chart Breakdown */}
        <div className="space-y-2.5 my-3">
          {days.map((d) => {
            const targetMin = (weekdayHours[d.key] || 0) * 60;
            const workedMin = weeklyData[d.key] || 0;
            const percent = targetMin > 0 ? Math.min(100, Math.round((workedMin / targetMin) * 100)) : (workedMin > 0 ? 100 : 0);
            const isCompleted = targetMin > 0 && workedMin >= targetMin;

            return (
              <div key={d.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 font-bold text-slate-600 dark:text-slate-300">{d.label}</span>
                    <span className="text-[11px] text-slate-400">
                      {targetMin > 0 ? `목표 ${(weekdayHours[d.key] || 0)}h` : '휴무'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {formatHoursMinutes(workedMin)}
                    </span>
                    {isCompleted && (
                      <CheckCircle size={12} className="text-emerald-500" />
                    )}
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
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

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            📊 요일별 근무 기록은 브라우저에 안전하게 보관됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
