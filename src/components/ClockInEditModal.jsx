/**
 * @file src/components/ClockInEditModal.jsx
 * @description 출근 시각 및 오늘 근무 형태(오전반차, 오후반차, 반반차) 설정 모달
 * 
 * [주요 역할]
 * - 오늘의 근무 형태(정상근무, 오전반차 4h, 오후반차 4h, 반반차 6h) 원클릭 선택
 * - 출근 버튼을 늦게 눌렀을 때 실제 출근 시각(오전/오후 H:MM)을 직접 지정
 * - 변경된 시각 및 점심시간을 감안하여 누적 순수 근무 시간을 자동 동기화
 */

import React, { useState, useMemo } from 'react';
import { Clock, Check, X, Sparkles, Briefcase } from 'lucide-react';
import {
  formatTo12Hour,
  parse12HourTime,
  calculateWorkedSecondsWithLunch,
  calculateEstimatedClockOut,
} from '../utils/timeFormat';
import { soundManager } from '../utils/audio';

export default function ClockInEditModal({
  currentClockInTime,
  elapsedSeconds,
  timerState,
  settings,
  currentWorkType = 'normal',
  baseTargetHours = 8,
  onSave,
  onClose,
}) {
  const initial = useMemo(() => parse12HourTime(currentClockInTime), [currentClockInTime]);

  const [workType, setWorkType] = useState(currentWorkType || 'normal'); // 'normal' | 'half_am' | 'half_pm' | 'quarter'
  const [period, setPeriod] = useState(initial.period); // '오전' | '오후'
  const [hour, setHour] = useState(initial.hours12); // 1..12
  const [minute, setMinute] = useState(initial.minutes); // 0..59
  const [startIfIdle, setStartIfIdle] = useState(timerState === 'IDLE');

  // Calculate target hours for chosen work type using settings preset
  const targetHours = useMemo(() => {
    const base = baseTargetHours ?? 8;
    // 1. 정상근무는 오늘 요일별 설정된 목표 근무시간(baseTargetHours)을 100% 반영
    if (workType === 'normal') {
      return base;
    }
    // 2. 반차 및 반반차: 기준 8시간 요일이면 프리셋 시간 반영, 그 외 요일은 요일 기준 비례 계산
    const presetHours = settings?.workTypePresets?.[workType]?.hours;
    if (base === 8 && typeof presetHours === 'number' && presetHours > 0) {
      return presetHours;
    }
    if (workType === 'half_am' || workType === 'half_pm') {
      return Math.max(1, Math.round(base / 2));
    }
    if (workType === 'quarter') {
      return Math.max(1, base - 2);
    }
    return base;
  }, [workType, baseTargetHours, settings]);

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

  // Calculate estimated clock-out time based on chosen clock-in and target hours, referencing workTypePreset
  const estimatedClockOutDate = useMemo(() => {
    return calculateEstimatedClockOut(selectedDate, targetHours, {
      autoLunchBreak: settings?.autoLunchBreak ?? true,
      lunchStart: settings?.lunchStart || '12:00',
      lunchEnd: settings?.lunchEnd || '13:00',
      workTypePreset: settings?.workTypePresets?.[workType],
    });
  }, [selectedDate, targetHours, settings, workType]);

  const formattedEstimatedClockOut = useMemo(() => {
    if (!estimatedClockOutDate) return null;
    return formatTo12Hour(estimatedClockOutDate);
  }, [estimatedClockOutDate]);

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

  // Tab selection: automatically applies the clock-in time configured in Settings for this work type
  const handleSelectWorkType = (type) => {
    setWorkType(type);
    soundManager.playClick();

    const preset = settings?.workTypePresets?.[type];
    if (preset?.clockIn) {
      const parsed = parse12HourTime(preset.clockIn);
      setPeriod(parsed.period);
      setHour(parsed.hours12);
      setMinute(parsed.minutes);
    } else {
      if (type === 'half_am') {
        setPeriod('오후');
        setHour(2);
        setMinute(0);
      } else {
        setPeriod('오전');
        setHour(9);
        setMinute(0);
      }
    }
  };

  const handleSave = () => {
    soundManager.playClick();
    onSave({
      newClockInTime: formatted12h,
      newElapsedSeconds: calculatedElapsedSec,
      startTimer: startIfIdle && timerState === 'IDLE',
      newWorkType: workType,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 bg-black/40 dark:bg-black/60 rounded-[28px] overflow-hidden animate-fadeIn">
      <div className="w-full max-w-[345px] max-h-[375px] bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-md border border-slate-200/90 dark:border-slate-700/80 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center">
              <Clock size={14} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">출근 시각 및 오늘 근무 형태</h3>
              <p className="text-[9.5px] text-slate-400">오전/오후반차, 반반차 및 출근 시각 설정</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1.5 py-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            닫기
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto py-2 pr-0.5 space-y-2.5">
          {/* 오늘의 근무 형태 선택 (정상 / 오전반차 / 오후반차 / 반반차) */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <Briefcase size={12} className="text-indigo-500" />
                오늘의 근무 형태
              </span>
              <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded-full border border-indigo-100 dark:border-indigo-900/40">
                목표 {targetHours}시간
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 text-[10px]">
              {[
                {
                  key: 'normal',
                  label: '정상근무',
                  sub: `${baseTargetHours ?? 8}h`,
                  icon: '🏢',
                },
                {
                  key: 'half_am',
                  label: '오전반차',
                  sub: `${(baseTargetHours ?? 8) === 8 ? (settings?.workTypePresets?.half_am?.hours ?? 4) : Math.max(1, Math.round((baseTargetHours ?? 8) / 2))}h`,
                  icon: '☀️',
                },
                {
                  key: 'half_pm',
                  label: '오후반차',
                  sub: `${(baseTargetHours ?? 8) === 8 ? (settings?.workTypePresets?.half_pm?.hours ?? 4) : Math.max(1, Math.round((baseTargetHours ?? 8) / 2))}h`,
                  icon: '☕',
                },
                {
                  key: 'quarter',
                  label: '반반차(연연차)',
                  sub: `${(baseTargetHours ?? 8) === 8 ? (settings?.workTypePresets?.quarter?.hours ?? 6) : Math.max(1, (baseTargetHours ?? 8) - 2)}h`,
                  icon: '⚡',
                },
              ].map((item) => {
                const isSelected = workType === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSelectWorkType(item.key)}
                    className={`py-1.5 px-0.5 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500 text-white shadow-xs font-bold ring-1 ring-indigo-400'
                        : 'bg-white dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-600'
                    }`}
                  >
                    <span className="text-xs mb-0.5">{item.icon}</span>
                    <span className="font-semibold text-[9.5px] leading-tight">{item.label}</span>
                    <span className={`text-[8.5px] mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {item.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main 12-Hour Picker */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">
                출근 시각 지정
              </span>
              {formattedEstimatedClockOut && (
                <span className="text-[9.5px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded-full border border-indigo-100 dark:border-indigo-900/40">
                  퇴근 예정 {formattedEstimatedClockOut}
                </span>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 pt-0.5">
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

              {workType === 'half_am' ? (
                <>
                  <button
                    type="button"
                    onClick={() => applyPreset('오후', 1, 0)}
                    className="py-1 px-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors"
                  >
                    오후 1:00
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('오후', 1, 30)}
                    className="py-1 px-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors"
                  >
                    오후 1:30
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('오후', 2, 0)}
                    className="py-1 px-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors"
                  >
                    오후 2:00
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Work Time Preview Info Box */}
          <div className="pt-0.5 space-y-1.5">
            <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-[10.5px] text-indigo-700 dark:text-indigo-300 leading-snug">
              <div className="flex items-center justify-between font-bold mb-0.5 text-indigo-800 dark:text-indigo-200">
                <span className="flex items-center gap-1">
                  <Sparkles size={12} className="text-indigo-500" />
                  근무 시간 자동 동기화
                </span>
                <span className="text-[9px] font-semibold text-indigo-600 dark:text-indigo-400">
                  🎯 오늘 목표: {targetHours}시간
                </span>
              </div>
              <p className="text-[10px] text-indigo-600/90 dark:text-indigo-300">
                출근 시각({formatted12h})에 맞춰 현재까지 근무한 시간이 <strong>{formattedCalculatedTime}</strong>(으)로 자동 계산됩니다.
              </p>
              {formattedEstimatedClockOut && (
                <div className="mt-1 flex items-center justify-between text-[10px] text-indigo-800 dark:text-indigo-200 font-semibold pt-1 border-t border-indigo-100 dark:border-indigo-900/40">
                  <span>🏃 예상 퇴근 시각</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{formattedEstimatedClockOut}</span>
                </div>
              )}
              {formattedLunchDeducted && (
                <div className="mt-1 inline-flex items-center gap-1 text-[9.5px] text-amber-700 dark:text-amber-300 font-semibold bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60">
                  <span>🍽️ 점심시간 {formattedLunchDeducted} 자동 제외 완료</span>
                </div>
              )}
            </div>

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
            <span>{targetHours}h 설정 저장</span>
          </button>
        </div>
      </div>
    </div>
  );
}
