import React, { useState } from 'react';
import {
  Settings,
  Clock,
  Coffee,
  LayoutGrid,
  Bell,
  ArrowUp,
  ArrowDown,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function SettingsModal({
  settings,
  setSettings,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('work'); // 'work' | 'pomodoro' | 'dock' | 'system'
  const [localSettings, setLocalSettings] = useState(JSON.parse(JSON.stringify(settings)));

  const dockItemLabels = {
    timer: { label: '타이머 상태', desc: '현재 진행 상태 점등 및 남은 시간 표시' },
    mascot: { label: '캐릭터 설정', desc: '상태별 캐릭터/이미지 교체' },
    todo: { label: 'Todo 할 일', desc: '당일 체크리스트 팝업' },
    achievements: { label: '업적 배지', desc: '달성 뱃지 및 동기부여' },
    stats: { label: '주간 요약', desc: '이번 주 요일별 근무 현황 차트' },
  };

  const days = [
    { key: 'mon', label: '월요일' },
    { key: 'tue', label: '화요일' },
    { key: 'wed', label: '수요일' },
    { key: 'thu', label: '목요일' },
    { key: 'fri', label: '금요일' },
    { key: 'sat', label: '토요일' },
    { key: 'sun', label: '일요일' },
  ];

  // Handle Day Hours Change
  const handleHourChange = (dayKey, val) => {
    const num = Math.max(0, Math.min(24, parseFloat(val) || 0));
    setLocalSettings((prev) => ({
      ...prev,
      weekdayHours: {
        ...prev.weekdayHours,
        [dayKey]: num,
      },
    }));
  };

  // Toggle Dock item selection (max 4)
  const toggleDockItem = (itemKey) => {
    setLocalSettings((prev) => {
      const current = prev.dockSlots || [];
      if (current.includes(itemKey)) {
        return {
          ...prev,
          dockSlots: current.filter((k) => k !== itemKey),
        };
      } else {
        if (current.length >= 4) {
          alert('좌측 도크에는 최대 4개 항목까지만 등록할 수 있습니다.');
          return prev;
        }
        return {
          ...prev,
          dockSlots: [...current, itemKey],
        };
      }
    });
    soundManager.playClick();
  };

  // Move Dock item up / down
  const moveDockItem = (idx, direction) => {
    setLocalSettings((prev) => {
      const slots = [...prev.dockSlots];
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= slots.length) return prev;
      const temp = slots[idx];
      slots[idx] = slots[targetIdx];
      slots[targetIdx] = temp;
      return { ...prev, dockSlots: slots };
    });
    soundManager.playClick();
  };

  const handleSave = () => {
    setSettings(localSettings);
    soundManager.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-[375px] bg-white/95 dark:bg-slate-900/95 rounded-2xl p-3 shadow-2xl border border-white/60 dark:border-slate-800 backdrop-blur-xl flex flex-col max-h-[365px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center">
              <Settings size={16} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">위젯 및 근무 설정</h3>
              <p className="text-[10px] text-slate-400">유연근무 시간, 휴식, 도크 및 시스템 환경설정</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-2 py-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            닫기
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 my-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl shrink-0">
          {[
            { id: 'work', label: '근무/점심', icon: Clock },
            { id: 'pomodoro', label: '뽀모도로', icon: Coffee },
            { id: 'dock', label: '도크', icon: LayoutGrid },
            { id: 'system', label: '시스템', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  soundManager.playClick();
                }}
                className={`flex-1 py-1 px-1.5 text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents (Scrollable) */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3 py-1">
          {/* TAB 1: Work Hours & Lunch */}
          {activeTab === 'work' && (
            <div className="space-y-4">
              {/* Daily Target Hours */}
              <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center justify-between">
                  <span>요일별 목표 근무 시간 (시차출퇴근제 / 자율근무)</span>
                  <span className="text-[11px] font-normal text-slate-400">단위: 시간(h)</span>
                </h4>
                <p className="text-[11px] text-slate-400 mb-3">
                  해당 요일에 접속하면 목표 시간이 자동으로 세팅됩니다.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {days.map((d) => (
                    <div
                      key={d.key}
                      className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
                    >
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {d.label}
                      </span>
                      <div className="flex items-center gap-1 mt-1.5">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="24"
                          value={localSettings.weekdayHours[d.key] ?? 8}
                          onChange={(e) => handleHourChange(d.key, e.target.value)}
                          className="w-14 px-2 py-1 text-xs font-bold text-slate-800 dark:text-slate-100 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <span className="text-xs text-slate-400 font-medium">시간</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lunch / Break Time */}
              <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      점심 및 휴식 시간 연동
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      점심시간에는 타이머가 자동으로 휴식 모드로 전환되며 캐릭터가 점심을 먹습니다.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.autoLunchBreak}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        autoLunchBreak: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-indigo-600 rounded-sm cursor-pointer"
                  />
                </div>

                {localSettings.autoLunchBreak && (
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">시작:</span>
                      <input
                        type="time"
                        value={localSettings.lunchStart || '12:00'}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({
                            ...prev,
                            lunchStart: e.target.value,
                          }))
                        }
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <span className="text-slate-300">~</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">종료:</span>
                      <input
                        type="time"
                        value={localSettings.lunchEnd || '13:00'}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({
                            ...prev,
                            lunchEnd: e.target.value,
                          }))
                        }
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Pomodoro Routine */}
          {activeTab === 'pomodoro' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      뽀모도로 주기 모드 사용
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      집중 N분 + 휴식 M분의 반복 주기 타이머를 함께 사용합니다.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.pomodoroEnabled}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        pomodoroEnabled: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-indigo-600 rounded-sm cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-400 block mb-1">집중 시간 (분)</span>
                    <input
                      type="number"
                      min="5"
                      max="120"
                      value={localSettings.pomodoroWorkMinutes || 25}
                      onChange={(e) =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          pomodoroWorkMinutes: parseInt(e.target.value) || 25,
                        }))
                      }
                      className="w-full px-2 py-1 text-xs font-bold text-slate-800 dark:text-slate-100 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center"
                    />
                  </div>

                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-400 block mb-1">휴식 시간 (분)</span>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={localSettings.pomodoroBreakMinutes || 5}
                      onChange={(e) =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          pomodoroBreakMinutes: parseInt(e.target.value) || 5,
                        }))
                      }
                      className="w-full px-2 py-1 text-xs font-bold text-slate-800 dark:text-slate-100 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center"
                    />
                  </div>

                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-slate-400 block mb-1">총 반복 주기</span>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={localSettings.pomodoroTotalCycles || 4}
                      onChange={(e) =>
                        setLocalSettings((prev) => ({
                          ...prev,
                          pomodoroTotalCycles: parseInt(e.target.value) || 4,
                        }))
                      }
                      className="w-full px-2 py-1 text-xs font-bold text-slate-800 dark:text-slate-100 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center"
                    />
                  </div>
                </div>

                {/* Important Notice requested by user */}
                <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-1.5">
                  <Sparkles size={14} className="shrink-0 mt-0.5" />
                  <span>
                    💡 <strong>마지막 주기 완료 규칙</strong>: 마지막 집중이 끝나면 휴식 없이 즉시 완료 처리됩니다.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Dock Management */}
          {activeTab === 'dock' && (
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl text-[11px] text-indigo-700 dark:text-indigo-300">
                ✨ 좌측 도크에 노출할 기능을 최대 4개까지 선택하고 순서를 지정할 수 있습니다.
                (전부 해제 시 도크 슬롯이 완전히 숨겨집니다)
              </div>

              {/* Selected Dock Items with Reordering */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                  현재 활성화된 도크 슬롯 ({localSettings.dockSlots.length} / 4)
                </span>

                {localSettings.dockSlots.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    선택된 도크 슬롯이 없습니다. (메인 타이머만 표시됩니다)
                  </div>
                ) : (
                  localSettings.dockSlots.map((slotKey, idx) => (
                    <div
                      key={slotKey}
                      className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 text-[11px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                            {dockItemLabels[slotKey]?.label}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {dockItemLabels[slotKey]?.desc}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveDockItem(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 hover:bg-slate-100 dark:hover:bg-slate-700"
                          title="위로 이동"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => moveDockItem(idx, 1)}
                          disabled={idx === localSettings.dockSlots.length - 1}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 hover:bg-slate-100 dark:hover:bg-slate-700"
                          title="아래로 이동"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Available Slots Checklist */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-2">
                  도크 기능 활성화 / 비활성화
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.keys(dockItemLabels).map((key) => {
                    const isChecked = localSettings.dockSlots.includes(key);
                    return (
                      <label
                        key={key}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800'
                            : 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-700/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleDockItem(key)}
                          className="mt-0.5 w-4 h-4 text-indigo-600 rounded-sm cursor-pointer"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                            {dockItemLabels[key].label}
                          </div>
                          <div className="text-[11px] text-slate-400 leading-snug">
                            {dockItemLabels[key].desc}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: System & Notifications */}
          {activeTab === 'system' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3.5">
                {/* 1. Continue in Background */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      백그라운드 계속 진행
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      OFF 시 창을 비활성화(blur)하면 자동 일시정지, ON 시 백그라운드에서도 근무 유지
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.continueInBackground}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        continueInBackground: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-indigo-600 rounded-sm cursor-pointer"
                  />
                </div>

                <div className="border-t border-slate-200/60 dark:border-slate-700/60" />

                {/* 2. OS Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      종료 및 퇴근 알림 (OS 푸시)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      퇴근 5분 전 사전 알림 및 완료 시 브라우저 네이티브 알림 발송
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.osNotifications}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (checked && typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
                        Notification.requestPermission();
                      }
                      setLocalSettings((prev) => ({
                        ...prev,
                        osNotifications: checked,
                      }));
                    }}
                    className="w-4 h-4 text-indigo-600 rounded-sm cursor-pointer"
                  />
                </div>

                <div className="border-t border-slate-200/60 dark:border-slate-700/60" />

                {/* 3. Show Skip Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      건너뛰기(Skip) 버튼 표시
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      컨트롤러 바에 단계 건너뛰기 액션 버튼을 노출합니다
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.showSkipButton}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        showSkipButton: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-indigo-600 rounded-sm cursor-pointer"
                  />
                </div>

                <div className="border-t border-slate-200/60 dark:border-slate-700/60" />

                {/* 4. Sound Effects */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      효과음 재생
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      출근 차임, 5분 전 알림음, 퇴근 팡파르 소리
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const next = !localSettings.soundEnabled;
                      soundManager.setMuted(!next);
                      if (next) soundManager.playClockIn();
                      setLocalSettings((prev) => ({ ...prev, soundEnabled: next }));
                    }}
                    className={`p-1.5 rounded-lg border flex items-center gap-1 text-xs font-semibold ${
                      localSettings.soundEnabled
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                        : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                    }`}
                  >
                    {localSettings.soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                    <span>{localSettings.soundEnabled ? '켜짐' : '음소거'}</span>
                  </button>
                </div>
              </div>

              {/* Privacy Isolation Notice */}
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-300">
                <ShieldCheck size={16} className="shrink-0" />
                <span>
                  <strong>안심 로컬 사용</strong>: 업무 기록과 타이머 내역은 외부 서버로 전송되지 않고 브라우저 로컬 저장소에만 안전하게 보관됩니다.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <Check size={13} />
            설정 저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
