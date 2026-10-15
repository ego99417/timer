import React from 'react';
import { Award, CheckCircle, Lock, Sparkles, Star } from 'lucide-react';

export default function AchievementsModal({ achievements, onClose }) {
  const badgeList = [
    {
      id: 'first_clock_in',
      title: '첫 출근 도장',
      desc: 'FluffyWork와 함께 힘찬 첫 출근을 시작했습니다.',
      icon: '🌱',
      progress: achievements.first_clock_in ? 100 : 0,
      unlocked: !!achievements.first_clock_in,
    },
    {
      id: 'punctual_king',
      title: '칼퇴의 요정',
      desc: '목표 근무 시간을 달성하고 기분 좋게 퇴근했습니다.',
      icon: '🏃💨',
      progress: achievements.punctual_king ? 100 : 0,
      unlocked: !!achievements.punctual_king,
    },
    {
      id: 'lunch_enjoyer',
      title: '든든한 점심시간',
      desc: '맛있는 점심과 함께 휴식 모드를 1회 이상 즐겼습니다.',
      icon: '🍱',
      progress: achievements.lunch_enjoyer ? 100 : 0,
      unlocked: !!achievements.lunch_enjoyer,
    },
    {
      id: 'task_slayer',
      title: '할 일 뽀개기',
      desc: '오늘 해야 할 Todo 리스트를 3개 이상 완료했습니다.',
      icon: '📝',
      progress: Math.min(100, Math.round(((achievements.completedTodosCount || 0) / 3) * 100)),
      unlocked: (achievements.completedTodosCount || 0) >= 3,
      currentText: `${Math.min(3, achievements.completedTodosCount || 0)} / 3`,
    },
    {
      id: 'deep_focus',
      title: '몰입의 달인',
      desc: '하루 4시간 이상의 근무 시간을 달성했습니다.',
      icon: '🔥',
      progress: achievements.deep_focus ? 100 : 0,
      unlocked: !!achievements.deep_focus,
    },
    {
      id: 'weekly_champion',
      title: '성실한 다람쥐',
      desc: '일주일 누적 목표 근무 시간을 100% 달성했습니다.',
      icon: '🐿️',
      progress: achievements.weekly_champion ? 100 : 0,
      unlocked: !!achievements.weekly_champion,
    },
  ];

  const unlockedCount = badgeList.filter((b) => b.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 bg-black/40 dark:bg-black/60 rounded-[28px] overflow-hidden animate-fadeIn">
      <div className="w-full max-w-[375px] max-h-[365px] bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-md border border-slate-200/90 dark:border-slate-700/80 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
              <Award size={16} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                업적 및 배지
                <span className="text-[10px] font-normal text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded-full">
                  {unlockedCount} / {badgeList.length} 달성
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">근무 목표를 달성하고 업적 배지를 모아보세요!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-2 py-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            닫기
          </button>
        </div>

        {/* Badge Grid - Scrollable */}
        <div className="grid grid-cols-2 gap-2 my-2 flex-1 min-h-0 overflow-y-auto pr-1">
          {badgeList.map((badge) => (
            <div
              key={badge.id}
              className={`p-2.5 rounded-xl border transition-all ${
                badge.unlocked
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/40 shadow-xs'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-800/50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xl drop-shadow-xs">{badge.icon}</span>
                {badge.unlocked ? (
                  <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                    <CheckCircle size={9} /> 달성
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                    <Lock size={9} /> 미달성
                  </span>
                )}
              </div>
              <h4 className="font-bold text-[11px] mt-1.5 text-slate-800 dark:text-slate-100">{badge.title}</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">{badge.desc}</p>
              
              {badge.currentText && !badge.unlocked && (
                <div className="mt-1.5">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 block text-right">{badge.currentText}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center shrink-0">
          <p className="text-[10px] text-slate-400">🌱 매일매일 건강하고 즐겁게 일하는 당신을 응원해요!</p>
        </div>
      </div>
    </div>
  );
}
