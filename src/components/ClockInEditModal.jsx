/**
 * @file src/components/ClockInEditModal.jsx
 * @description 출근 시각 직접 변경 모달 컴포넌트
 * 
 * [주요 역할]
 * - 출근 버튼을 늦게 눌렀을 때 실제 출근 시각(오전/오후 H:MM)을 직접 지정
 * - '지금', '10분 전', '30분 전' 등 빠른 프리셋 버튼 제공
 * - 변경된 시각에 맞춰 누적 근무 시간(경과 시간)을 자동 재계산하여 동기화
 */

import React, { useState, useMemo } from 'react';
import { Clock, Check, X, Sparkles, RotateCcw } from 'lucide-react';
import { formatTo12Hour, parse12HourTime, calculateWorkedSecondsWithLunch } from '../utils/timeFormat';
import { soundManager } from '../utils/audio';

export default function ClockInEditModal({
  currentClockInTime,
  elapsedSeconds,
  timerState,
  settings,
  onSave,
  onClose,
}) {
  const initial = useMemo(() => parse12HourTime(currentClockInTime), [currentClockInTime]);

  const [period, setPeriod] = useState(initial.period); // '오전' | '오후'
  const [hour, setHour] = useState(initial.hours12); // 1..12
  const [minute, setMinute] = useState(initial.minutes); // 0..59
  const [syncElapsed, setSyncElapsed] = useState(true); // whether to auto-recalculate elapsedSeconds
  const [startIfIdle, setStartIfIdle] = useState(timerState === 'IDLE');

  // Convert selected (period, hour, minute) to 24-hour Date on today
  const selectedDate = useMemo(() => {
    let h24 = hour % 12;
    if (period === '오후') h24 += 12;

    const d = new Date();
    d.setHours(h24, minute, 0, 0);
    return d;
  }, [period, hour, minute]);

  // Formatted 12-hour string
  const formatted12h = useMemo(() => {
    const displayMins = minute.toString().padStart(2, '0');
    return `${period} ${hour}:${displayMins}`;
  }, [period, hour, minute]);

  // Calculate estimated net elapsed seconds based on chosen clock-in time (deducting lunch break)
  const { netWorkedSeconds: calculatedElapsedSec, lunchDeductedSeconds } = useMemo(() => {
    const now = new Date();
    return calculateWorkedSecondsWithLunch(selectedDate, now, {
      autoLunchBreak: settings?.autoLunchBreak ?? true,
      lunchStart: settings?.lunchStart || '12:00',
      lunchEnd: settings?.lunchEnd || '13:00',
    });
  }, [selectedDate, settings]);

  const formattedCalculatedTime = useMemo(() => {
    const h = Math.floor(calculatedElapsedSec / 3600);
    const m = Math.floor((calculatedElapsedSec % 3600) / 60);
    if (h > 0) return `${h}시간 ${m}분`;
    return `${m}분`;
  }, [calculatedElapsedSec]);

  const formattedLunchDeducted = useMemo(() => {
    if (!lunchDeductedSeconds || lunchDeductedSeconds <= 0) return null;
    const m = Math.round(lunchDeductedSeconds / 60);
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const remM = m % 60;
      return remM > 0 ? `${h}시간 ${remM}분` : `${h}시간`;
    }
    return `${m}분`;
  }, [lunchDeductedSeconds]);

  // Quick Preset Actions
  const applyPreset = (presetPeriod, presetH12, presetM) => {
    setPeriod(presetPeriod);
    setHour(presetH12);
    setMinute(presetM);
    soundManager.playClick();
  };

  const applyNow = () => {
    const now = new Date();
    const parsed = parse12HourTime(formatTo12Hour(now));
    applyPreset(parsed.period, parsed.hours12, parsed.minutes);
  };

  const applyMinutesAgo = (minutesAgo) => {
    const target = new Date(Date.now() - minutesAgo * 60 * 1000);
    const parsed = parse12HourTime(formatTo12Hour(target));
    applyPreset(parsed.period, parsed.hours12, parsed.minutes);
  };

  const handleSave = () => {
    soundManager.playClick();
    onSave({
      newClockInTime: formatted12h,
      newElapsedSeconds: syncElapsed ? calculatedElapsedSec : elapsedSeconds,
      startTimer: startIfIdle && timerState === 'IDLE',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 bg-black/40 dark:bg-black/60 rounded-[28px] overflow-hidden animate-fadeIn">
      <div className="w-full max-w-[340px] bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-md border border-slate-200/90 dark:border-slate-700/80 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center">
              <Clock size={14} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">출근 시각 직접 변경</h3>
              <p className="text-[9.5px] text-slate-400">12시간제(오전/오후) 기준으로 출근 시각을 설정합니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1.5 py-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            닫기
          </button>
        </div>

        {/* Time Selection Controls */}
        <div className="py-2.5 space-y-2.5">
          {/* Main 12-Hour Picker */}
          <div className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            {/* AM / PM Toggle */}
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => {
                  setPeriod('오전');
                  soundManager.playClick();
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  period === '오전'
                    ? 'bg-indigo-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                오전
              </button>
              <button
                type="button"
                onClick={() => {
                  setPeriod('오후');
                  soundManager.playClick();
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  period === '오후'
                    ? 'bg-indigo-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                오후
              </button>
            </div>

            {/* Hour Picker */}
            <div className="flex flex-col items-center">
              <label className="text-[9px] font-semibold text-slate-400 mb-0.5">시 (Hour)</label>
              <select
                value={hour}
                onChange={(e) => setHour(parseInt(e.target.value, 10))}
                className="w-16 px-2 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-center text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>
                    {h}시
                  </option>
                ))}
              </select>
            </div>

            <span className="text-base font-bold text-slate-400 mt-3">:</span>

            {/* Minute Picker */}
            <div className="flex flex-col items-center">
              <label className="text-[9px] font-semibold text-slate-400 mb-0.5">분 (Minute)</label>
              <select
                value={minute}
                onChange={(e) => setMinute(parseInt(e.target.value, 10))}
                className="w-16 px-2 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-center text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {Array.from({ length: 60 }, (_, m) => (
                  <option key={m} value={m}>
                    {m.toString().padStart(2, '0')}분
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[9.5px] font-semibold text-slate-400 block mb-1">빠른 선택</span>
            <div className="grid grid-cols-4 gap-1 text-[10px]">
              <button
                type="button"
                onClick={applyNow}
                className="py-1 px-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors"
              >
                지금 시각
              </button>
              <button
                type="button"
                onClick={() => applyMinutesAgo(10)}
                className="py-1 px-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors"
              >
                10분 전
              </button>
              <button
                type="button"
                onClick={() => applyMinutesAgo(30)}
                className="py-1 px-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors"
              >
                30분 전
              </button>
              <button
                type="button"
                onClick={() => applyMinutesAgo(60)}
                className="py-1 px-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors"
              >
                1시간 전
              </button>
              <button
                type="button"
                onClick={() => applyPreset('오전', 9, 0)}
                className="py-1 px-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors"
              >
                오전 9:00
              </button>
              <button
                type="button"
                onClick={() => applyPreset('오전', 9, 30)}
                className="py-1 px-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors"
              >
                오전 9:30
              </button>
              <button
                type="button"
                onClick={() => applyPreset('오전', 10, 0)}
                className="py-1 px-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors"
              >
                오전 10:00
              </button>
              <button
                type="button"
                onClick={() => applyPreset('오후', 1, 0)}
                className="py-1 px-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors"
              >
                오후 1:00
              </button>
            </div>
          </div>

          {/* Smart Auto Sync Elapsed Option */}
          <div className="space-y-1.5 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={syncElapsed}
                onChange={(e) => setSyncElapsed(e.target.checked)}
                className="w-3.5 h-3.5 text-indigo-600 rounded-sm cursor-pointer"
              />
              <span className="text-[10.5px] font-medium text-slate-700 dark:text-slate-300">
                출근 시각에 맞춰 현재 근무 시간도 자동 계산
              </span>
            </label>

            {syncElapsed && (
              <div className="p-2 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-[10px] text-indigo-700 dark:text-indigo-300 leading-tight">
                💡 변경 시 현재까지 순수 근무 시간이 <strong>{formattedCalculatedTime}</strong>(으)로 조정됩니다.
                {formattedLunchDeducted && (
                  <span className="block mt-0.5 text-[9.5px] text-amber-600 dark:text-amber-400 font-semibold">
                    🍽️ 점심시간 {formattedLunchDeducted} 자동 제외 완료
                  </span>
                )}
              </div>
            )}

            {timerState === 'IDLE' && (
              <label className="flex items-center gap-1.5 cursor-pointer select-none pt-0.5">
                <input
                  type="checkbox"
                  checked={startIfIdle}
                  onChange={(e) => setStartIfIdle(e.target.checked)}
                  className="w-3.5 h-3.5 text-indigo-600 rounded-sm cursor-pointer"
                />
                <span className="text-[10.5px] font-medium text-slate-700 dark:text-slate-300">
                  저장과 동시에 바로 근무(출근) 타이머 시작
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-bold bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white rounded-lg shadow-sm transition-all flex items-center gap-1"
          >
            <Check size={13} />
            {formatted12h} 저장
          </button>
        </div>
      </div>
    </div>
  );
}
