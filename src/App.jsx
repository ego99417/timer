/**
 * @file src/App.jsx
 * @description FluffyWork 타이머의 핵심 상태 관리 및 메인 화면 제어 컴포넌트
 * 
 * [주요 역할]
 * 1. 5가지 타이머 상태(IDLE 대기, RUNNING 근무, REST 점심/휴식, PAUSED 일시정지, COMPLETED 퇴근완료) 관리
 * 2. 1초마다 남은 시간 계산 및 점심시간 자동 감지/휴식 모드 전환
 * 3. 출근 시각 기록 및 퇴근 5분 전 사전 알림, 퇴근 시간 자동 종료 연출
 * 4. 요일별 목표 시간, 점심시간, 투두리스트, 업적 데이터의 localStorage 영구 저장
 * 5. 다크 모드, 사운드 음소거, 미니 플로팅 바 모드 및 각종 모달 팝업 상태 제어
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  Square,
  SkipForward,
  Minimize2,
  Maximize2,
  Settings,
  Sparkles,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Clock,
  Coffee,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Minus,
  X,
  Edit2,
} from "lucide-react";
import DockBar from "./components/DockBar";
import CircularTimer from "./components/CircularTimer";
import MiniModeBar from "./components/MiniModeBar";
import TodoList from "./components/TodoList";
import AchievementsModal from "./components/AchievementsModal";
import WeeklyStatsModal from "./components/WeeklyStatsModal";
import MascotSettingsModal from "./components/MascotSettingsModal";
import SettingsModal from "./components/SettingsModal";
import CelebrationModal from "./components/CelebrationModal";
import WarningToast from "./components/WarningToast";
import ClockInEditModal from "./components/ClockInEditModal";
import { soundManager } from "./utils/audio";
import {
  formatTo12Hour,
  parse12HourTime,
  calculateWorkedSecondsWithLunch,
  calculateEstimatedClockOut,
  calculateNetHoursBetween,
} from "./utils/timeFormat";

// Helper to get today's date formatted as YYYY-MM-DD
const getTodayDateStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Helper to get today's key: mon, tue, wed, thu, fri, sat, sun
const getTodayKey = () => {
  const dayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon...
  const map = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return map[dayIndex];
};

const DAY_LABELS = {
  mon: "월요일",
  tue: "화요일",
  wed: "수요일",
  thu: "목요일",
  fri: "금요일",
  sat: "토요일",
  sun: "일요일",
};

export const DEFAULT_WORK_TYPE_PRESETS = {
  normal: { clockIn: "09:00", clockOut: "18:00", hours: 8 },
  half_am: { clockIn: "14:00", clockOut: "18:00", hours: 4 },
  half_pm: { clockIn: "09:00", clockOut: "13:00", hours: 4 },
  quarter: { clockIn: "09:00", clockOut: "16:00", hours: 6 },
};

export const WORK_TYPE_LABELS = {
  normal: { label: "정상근무", short: "" },
  half_am: { label: "오전반차", short: "오전반차" },
  half_pm: { label: "오후반차", short: "오후반차" },
  quarter: { label: "반반차(연연차)", short: "반반차" },
};

export default function App() {
  // 1. Persistent Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("fluffy_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          workTypePresets: {
            ...DEFAULT_WORK_TYPE_PRESETS,
            ...(parsed.workTypePresets || {}),
          },
        };
      } catch {
        // fallback
      }
    }
    return {
      weekdayHours: { mon: 8, tue: 8, wed: 8, thu: 8, fri: 8, sat: 0, sun: 0 },
      autoLunchBreak: true,
      lunchStart: "12:00",
      lunchEnd: "13:00",
      workTypePresets: DEFAULT_WORK_TYPE_PRESETS,
      dockSlots: ["timer", "mascot", "todo", "stats"],
      pomodoroEnabled: false,
      pomodoroWorkMinutes: 25,
      pomodoroBreakMinutes: 5,
      pomodoroTotalCycles: 4,
      continueInBackground: true,
      osNotifications: true,
      showSkipButton: true,
      soundEnabled: true,
      darkMode: false,
    };
  });

  // 2. Custom mascot images
  const [customImages, setCustomImages] = useState(() => {
    const saved = localStorage.getItem("fluffy_mascot_images");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return { FOCUS: "", REST: "", PAUSED: "", COMPLETED: "" };
  });

  // 3. Todos
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("fluffy_todos");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // 4. Weekly Stats (minutes worked)
  const [weeklyData, setWeeklyData] = useState(() => {
    const saved = localStorage.getItem("fluffy_weekly_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 };
  });

  // 5. Achievements
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem("fluffy_achievements");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      first_clock_in: false,
      punctual_king: false,
      lunch_enjoyer: false,
      completedTodosCount: 0,
      deep_focus: false,
      weekly_champion: false,
    };
  });

  // 6. View Mode ('normal' | 'mini')
  const [viewMode, setViewMode] = useState("normal");

  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    if (window.electronAPI?.setMode) {
      window.electronAPI.setMode(mode);
    }
  };

  useEffect(() => {
    if (window.electronAPI?.onModeChanged) {
      window.electronAPI.onModeChanged((mode) => {
        setViewMode(mode);
      });
    }
  }, []);

  // 7. Timer Runtime State (Date-aware persistence)
  const [timerState, setTimerState] = useState(() => {
    const todayDateStr = getTodayDateStr();
    const savedWorkDate = localStorage.getItem("fluffy_work_date");
    if (savedWorkDate !== todayDateStr) return "IDLE";
    const saved = localStorage.getItem("fluffy_timer_state");
    if (saved === "FOCUS" || saved === "REST") return "PAUSED";
    return saved || "IDLE";
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(() => {
    const todayDateStr = getTodayDateStr();
    const savedWorkDate = localStorage.getItem("fluffy_work_date");
    if (savedWorkDate !== todayDateStr) return 0;
    const saved = localStorage.getItem("fluffy_elapsed_seconds");
    return saved ? Math.max(0, parseInt(saved, 10) || 0) : 0;
  });
  const [clockInTime, setClockInTime] = useState(() => {
    const todayDateStr = getTodayDateStr();
    const savedWorkDate = localStorage.getItem("fluffy_work_date");
    if (savedWorkDate !== todayDateStr) return null;
    const saved = localStorage.getItem("fluffy_clock_in_time");
    return saved ? formatTo12Hour(saved) : null;
  });
  const [clockOutTime, setClockOutTime] = useState(() => {
    const todayDateStr = getTodayDateStr();
    const savedWorkDate = localStorage.getItem("fluffy_work_date");
    if (savedWorkDate !== todayDateStr) return null;
    const saved = localStorage.getItem("fluffy_clock_out_time");
    return saved ? formatTo12Hour(saved) : null;
  });
  const [hasTriggered5MinAlert, setHasTriggered5MinAlert] = useState(false);
  const [warningToastVisible, setWarningToastVisible] = useState(false);
  const [celebrationModalVisible, setCelebrationModalVisible] = useState(false);
  const [celebrationSummary, setCelebrationSummary] = useState(null);

  // Pomodoro runtime
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isRestPeriod, setIsRestPeriod] = useState(false);
  const [pomodoroSecondsLeft, setPomodoroSecondsLeft] = useState(25 * 60);

  // Active Modals: null | 'settings' | 'mascot' | 'todo' | 'achievements' | 'stats'
  const [activeModal, setActiveModal] = useState(null);

  // References for accurate timestamp delta
  const lastTickRef = useRef(Date.now());
  const timerStateRef = useRef(timerState);
  timerStateRef.current = timerState;
  const hasTriggeredAutoClockOutRef = useRef(false);

  // Today's Work Type: 'normal' | 'half_am' | 'half_pm' | 'quarter'
  const [todayWorkType, setTodayWorkType] = useState(() => {
    const todayDateStr = getTodayDateStr();
    const savedWorkDate = localStorage.getItem("fluffy_work_date");
    if (savedWorkDate !== todayDateStr) return "normal";
    return localStorage.getItem("fluffy_today_work_type") || "normal";
  });

  useEffect(() => {
    localStorage.setItem("fluffy_today_work_type", todayWorkType);
  }, [todayWorkType]);

  const todayKey = getTodayKey();
  const baseTargetHours = settings.weekdayHours[todayKey] ?? 8;
  const targetHoursToday = (() => {
    // 1. 정상근무는 요일별 목표 근무시간(weekdayHours)을 100% 반영
    if (todayWorkType === "normal") {
      return baseTargetHours;
    }
    // 2. 반차 및 반반차: 프리셋의 clockIn / clockOut으로 순수 근무시간 우선 계산!
    const preset = settings?.workTypePresets?.[todayWorkType];
    if (preset?.clockIn && preset?.clockOut) {
      const netH = calculateNetHoursBetween(preset.clockIn, preset.clockOut, {
        autoLunchBreak: settings.autoLunchBreak,
        lunchStart: settings.lunchStart,
        lunchEnd: settings.lunchEnd,
      });
      if (netH > 0) {
        return netH;
      }
    }
    const presetHours = preset?.hours;
    if (baseTargetHours === 8 && typeof presetHours === "number" && presetHours > 0) {
      return presetHours;
    }
    if (todayWorkType === "half_am" || todayWorkType === "half_pm") {
      return Math.max(1, Math.round(baseTargetHours / 2));
    }
    if (todayWorkType === "quarter") {
      return Math.max(1, baseTargetHours - 2);
    }
    return baseTargetHours;
  })();
  const totalTargetSeconds = targetHoursToday * 3600;
  const remainingSeconds = Math.max(0, totalTargetSeconds - elapsedSeconds);

  // Estimated clock-out time calculation referencing settings workTypePreset and clockInTime
  const formattedEstimatedClockOut = useMemo(() => {
    const preset = settings?.workTypePresets?.[todayWorkType];

    const refClockInDate = new Date();
    if (clockInTime) {
      const parsed = parse12HourTime(clockInTime);
      refClockInDate.setHours(parsed.hours24, parsed.minutes, 0, 0);
    } else {
      const [pH, pM] = (preset?.clockIn || "09:00").split(":").map(Number);
      refClockInDate.setHours(isNaN(pH) ? 9 : pH, isNaN(pM) ? 0 : pM, 0, 0);
    }

    const outDate = calculateEstimatedClockOut(refClockInDate, targetHoursToday, {
      autoLunchBreak: settings.autoLunchBreak,
      lunchStart: settings.lunchStart,
      lunchEnd: settings.lunchEnd,
      workTypePreset: preset,
      isNormalWork: todayWorkType === "normal",
    });

    if (outDate) {
      return formatTo12Hour(outDate);
    }
    return preset?.clockOut ? formatTo12Hour(preset.clockOut) : "오후 6:00";
  }, [clockInTime, targetHoursToday, todayWorkType, settings]);

  // Update theme on document
  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [settings.darkMode]);

  // Sync mute state
  useEffect(() => {
    soundManager.setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("fluffy_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("fluffy_mascot_images", JSON.stringify(customImages));
  }, [customImages]);

  useEffect(() => {
    localStorage.setItem("fluffy_todos", JSON.stringify(todos));
    const completedCount = todos.filter((t) => t.completed).length;
    setAchievements((prev) => ({
      ...prev,
      completedTodosCount: completedCount,
    }));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("fluffy_weekly_data", JSON.stringify(weeklyData));
  }, [weeklyData]);

  useEffect(() => {
    localStorage.setItem("fluffy_achievements", JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem("fluffy_work_date", getTodayDateStr());
    if (clockInTime) {
      localStorage.setItem("fluffy_clock_in_time", clockInTime);
    } else {
      localStorage.removeItem("fluffy_clock_in_time");
    }
  }, [clockInTime]);

  useEffect(() => {
    localStorage.setItem("fluffy_work_date", getTodayDateStr());
    if (clockOutTime) {
      localStorage.setItem("fluffy_clock_out_time", clockOutTime);
    } else {
      localStorage.removeItem("fluffy_clock_out_time");
    }
  }, [clockOutTime]);

  useEffect(() => {
    localStorage.setItem("fluffy_work_date", getTodayDateStr());
    localStorage.setItem("fluffy_elapsed_seconds", String(elapsedSeconds));
  }, [elapsedSeconds]);

  useEffect(() => {
    localStorage.setItem("fluffy_work_date", getTodayDateStr());
    localStorage.setItem("fluffy_timer_state", timerState);
  }, [timerState]);

  // Request notification permission if enabled
  useEffect(() => {
    if (settings.osNotifications && typeof Notification !== "undefined") {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, [settings.osNotifications]);

  // Window blur / visibility change listener for "Continue in Background"
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!settings.continueInBackground && document.hidden) {
        if (timerStateRef.current === "FOCUS" || timerStateRef.current === "REST") {
          setTimerState("PAUSED");
        }
      }
    };

    const handleBlur = () => {
      if (!settings.continueInBackground) {
        if (timerStateRef.current === "FOCUS" || timerStateRef.current === "REST") {
          setTimerState("PAUSED");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [settings.continueInBackground]);

  // Send OS Notification helper
  const sendOSNotification = (title, body) => {
    if (settings.osNotifications && typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        new Notification(title, { body, icon: "/favicon.svg" });
      } catch {
        // Notification error fallback
      }
    }
  };

  // Check Lunch Break Time Range
  const isCurrentlyLunchTime = () => {
    if (!settings.autoLunchBreak || !settings.lunchStart || !settings.lunchEnd) return false;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = settings.lunchStart.split(":").map(Number);
    const [endH, endM] = settings.lunchEnd.split(":").map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;

    return currentMins >= startMins && currentMins < endMins;
  };

  // Clock In Action
  const handleClockIn = () => {
    const now = new Date();
    const nowStr = formatTo12Hour(now);

    // If clocking in again after completing today's work, start a new session / reset
    if (timerState === "COMPLETED") {
      setElapsedSeconds(0);
      setClockInTime(nowStr);
      setClockOutTime(null);
      setHasTriggered5MinAlert(false);
      hasTriggeredAutoClockOutRef.current = false;
    } else if (timerState === "IDLE") {
      // First time starting today
      if (!clockInTime) {
        setClockInTime(nowStr);
        setElapsedSeconds(0);
      } else {
        // Clock-in time was pre-configured manually in the edit modal
        // If elapsedSeconds is 0, auto-sync elapsed time to the difference between clockInTime and now (deducting lunch)
        if (elapsedSeconds === 0) {
          const parsed = parse12HourTime(clockInTime);
          const clockInDate = new Date();
          clockInDate.setHours(parsed.hours24, parsed.minutes, 0, 0);
          const { netWorkedSeconds } = calculateWorkedSecondsWithLunch(clockInDate, now, {
            autoLunchBreak: settings.autoLunchBreak,
            lunchStart: settings.lunchStart,
            lunchEnd: settings.lunchEnd,
          });
          if (netWorkedSeconds > 0) {
            setElapsedSeconds(netWorkedSeconds);
          }
        }
      }
      setClockOutTime(null);
      setHasTriggered5MinAlert(false);
      hasTriggeredAutoClockOutRef.current = false;
    }

    // Check if right now is lunch time
    if (settings.autoLunchBreak && isCurrentlyLunchTime()) {
      setTimerState("REST");
      soundManager.playRestChime();
    } else {
      setTimerState("FOCUS");
      soundManager.playClockIn();
    }

    setAchievements((prev) => ({ ...prev, first_clock_in: true }));
    lastTickRef.current = Date.now();
  };

  // Directly change / register Clock In Time & Work Type
  const handleSaveClockInTime = ({ newClockInTime, newElapsedSeconds, startTimer, newWorkType }) => {
    setClockInTime(newClockInTime);
    if (newWorkType) {
      setTodayWorkType(newWorkType);
    }
    if (typeof newElapsedSeconds === "number") {
      setElapsedSeconds(newElapsedSeconds);
      lastTickRef.current = Date.now();
      if (totalTargetSeconds - newElapsedSeconds > 0) {
        hasTriggeredAutoClockOutRef.current = false;
        setHasTriggered5MinAlert(false);
      }
    }
    if (startTimer && (timerState === "IDLE" || timerState === "COMPLETED")) {
      setClockOutTime(null);
      if (settings.autoLunchBreak && isCurrentlyLunchTime()) {
        setTimerState("REST");
        soundManager.playRestChime();
      } else {
        setTimerState("FOCUS");
        soundManager.playClockIn();
      }
      setAchievements((prev) => ({ ...prev, first_clock_in: true }));
    }
  };

  // Pause Action
  const handlePause = () => {
    setTimerState("PAUSED");
    soundManager.playClick();
  };

  // Clock Out Action (Manual or Automatic)
  const handleClockOut = (isAuto = false) => {
    hasTriggeredAutoClockOutRef.current = true;

    // If currently in mini mode, automatically restore to normal widget mode
    // so the celebration modal and stats are fully displayed at 395x400!
    handleSetViewMode("normal");

    const nowStr = formatTo12Hour(new Date());
    setClockOutTime(nowStr);
    const workedMins = Math.round(elapsedSeconds / 60);

    // Update weekly worked data
    setWeeklyData((prev) => ({
      ...prev,
      [todayKey]: Math.max(prev[todayKey] || 0, workedMins),
    }));

    // Unlock achievements
    setAchievements((prev) => ({
      ...prev,
      punctual_king: true,
      deep_focus: elapsedSeconds >= 4 * 3600 ? true : prev.deep_focus,
    }));

    // Play celebration sound
    soundManager.playCelebrationFanfare();

    // Setup celebration summary
    const hours = Math.floor(elapsedSeconds / 3600);
    const mins = Math.floor((elapsedSeconds % 3600) / 60);
    const secs = Math.floor(elapsedSeconds % 60);
    const workedFormatted = `${hours}시간 ${mins}분 ${secs}초`;

    const completionRate =
      totalTargetSeconds > 0 ? Math.min(100, Math.round((elapsedSeconds / totalTargetSeconds) * 100)) : 100;

    setCelebrationSummary({
      workedFormatted,
      clockInTime: clockInTime || nowStr,
      clockOutTime: nowStr,
      completionRate,
      isAuto,
    });

    setTimerState("COMPLETED");
    setCelebrationModalVisible(true);

    if (isAuto) {
      sendOSNotification(
        "🎉 목표 근무시간 달성! 자동 퇴근 완료",
        "오늘 설정하신 근무 시간을 모두 채웠습니다. 수고 많으셨습니다!",
      );
    }
  };

  // Skip Step Action
  const handleSkip = () => {
    soundManager.playClick();
    if (settings.pomodoroEnabled) {
      // Advance pomodoro step
      if (!isRestPeriod) {
        // Work ended
        if (currentCycle >= settings.pomodoroTotalCycles) {
          // Rule: If final work cycle ends, do NOT enter rest. Immediately complete!
          handleClockOut(true);
        } else {
          setIsRestPeriod(true);
          setTimerState("REST");
          setPomodoroSecondsLeft(settings.pomodoroBreakMinutes * 60);
          soundManager.playRestChime();
        }
      } else {
        // Rest ended, go to next work cycle
        setIsRestPeriod(false);
        setCurrentCycle((prev) => prev + 1);
        setTimerState("FOCUS");
        setPomodoroSecondsLeft(settings.pomodoroWorkMinutes * 60);
        soundManager.playClockIn();
      }
    } else {
      // In flexible work mode, skip toggles between Focus and Rest
      if (timerState === "FOCUS") {
        setTimerState("REST");
        soundManager.playRestChime();
      } else if (timerState === "REST") {
        setTimerState("FOCUS");
        soundManager.playClockIn();
      }
    }
  };

  // Main 1-Second Master Tick Interval
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaSec = Math.round((now - lastTickRef.current) / 1000);
      lastTickRef.current = now;

      if (deltaSec <= 0) return;

      // Handle Automatic Lunch Break switch
      if (settings.autoLunchBreak && (timerState === "FOCUS" || timerState === "REST")) {
        const inLunch = isCurrentlyLunchTime();
        if (inLunch && timerState === "FOCUS") {
          setTimerState("REST");
          soundManager.playRestChime();
          setAchievements((prev) => ({ ...prev, lunch_enjoyer: true }));
        } else if (!inLunch && timerState === "REST" && !settings.pomodoroEnabled) {
          // Lunch ended
          setTimerState("FOCUS");
          soundManager.playClockIn();
        }
      }

      // If Active Focus
      if (timerState === "FOCUS") {
        setElapsedSeconds((prev) => {
          const next = prev + deltaSec;
          const remaining = Math.max(0, totalTargetSeconds - next);

          // 1. 5-Minute Warning Check (<= 300 seconds)
          if (remaining <= 300 && remaining > 0 && !hasTriggered5MinAlert && totalTargetSeconds > 300) {
            setHasTriggered5MinAlert(true);
            setWarningToastVisible(true);
            soundManager.playWarningChime();
            sendOSNotification("🔔 퇴근 5분 전입니다!", "슬슬 마무리 준비를 시작하세요 🏃💨");
            // If currently in mini mode, auto-expand to normal mode so the alert and squirrel mascot are clearly visible!
            handleSetViewMode("normal");
          }

          // 2. Automatic Clock-out when remaining reaches 0 (triggers once)
          if (remaining <= 0 && !hasTriggeredAutoClockOutRef.current) {
            hasTriggeredAutoClockOutRef.current = true;
            setTimeout(() => handleClockOut(true), 0);
          }

          return next;
        });

        // If Pomodoro cycle countdown active
        if (settings.pomodoroEnabled) {
          setPomodoroSecondsLeft((prev) => {
            const next = prev - deltaSec;
            if (next <= 0) {
              // Work cycle finished!
              if (currentCycle >= settings.pomodoroTotalCycles && !hasTriggeredAutoClockOutRef.current) {
                hasTriggeredAutoClockOutRef.current = true;
                // Rule: "마지막 집중 주기가 끝나는 순간 휴식 단계로 넘어가지 않고 즉시 종료."
                setTimeout(() => handleClockOut(true), 0);
                return 0;
              } else {
                setIsRestPeriod(true);
                setTimerState("REST");
                soundManager.playRestChime();
                return settings.pomodoroBreakMinutes * 60;
              }
            }
            return next;
          });
        }
      } else if (timerState === "REST" && settings.pomodoroEnabled) {
        // Break cycle countdown
        setPomodoroSecondsLeft((prev) => {
          const next = prev - deltaSec;
          if (next <= 0) {
            // Break finished, go to next focus cycle
            setIsRestPeriod(false);
            setCurrentCycle((c) => c + 1);
            setTimerState("FOCUS");
            soundManager.playClockIn();
            return settings.pomodoroWorkMinutes * 60;
          }
          return next;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    timerState,
    totalTargetSeconds,
    hasTriggered5MinAlert,
    settings.autoLunchBreak,
    settings.pomodoroEnabled,
    currentCycle,
    settings.pomodoroTotalCycles,
    settings.pomodoroBreakMinutes,
    settings.pomodoroWorkMinutes,
  ]);

  // Force expand to normal view whenever celebration modal opens
  useEffect(() => {
    if (celebrationModalVisible && viewMode === "mini") {
      handleSetViewMode("normal");
    }
  }, [celebrationModalVisible, viewMode]);

  // Mini mode bar view
  if (viewMode === "mini") {
    return (
      <div
        className={`w-full h-full flex items-center justify-center p-1 select-none overflow-hidden ${settings.darkMode ? "dark" : ""}`}
      >
        <MiniModeBar
          timerState={timerState}
          remainingSeconds={remainingSeconds}
          customImages={customImages}
          progressPercent={totalTargetSeconds > 0 ? (elapsedSeconds / totalTargetSeconds) * 100 : 0}
          onPlayResume={handleClockIn}
          onPause={handlePause}
          onClockOut={() => {
            handleSetViewMode("normal");
            handleClockOut(false);
          }}
          onExpand={() => handleSetViewMode("normal")}
        />
        {warningToastVisible && <WarningToast onClose={() => setWarningToastVisible(false)} />}
      </div>
    );
  }

  // Normal view mode
  const hasDockSlots = settings.dockSlots && settings.dockSlots.length > 0;
  const isElectron = typeof window !== "undefined" && Boolean(window.electronAPI?.isElectron);

  return (
    <div
      className={`w-full h-full relative select-none overflow-hidden ${settings.darkMode ? "dark" : ""} ${
        !isElectron ? "bg-slate-100/90 dark:bg-slate-950 flex items-center justify-center p-2 sm:p-4" : ""
      }`}
    >

      {/* Main Glassmorphic Container (Fits 395x400 on Desktop or mobile card) */}
      <div
        className={`w-full h-full ${
          !isElectron ? "max-w-[395px] max-h-[460px] shadow-2xl" : ""
        } glass-panel rounded-[28px] p-3.5 flex flex-col justify-between overflow-hidden relative border border-white/80 dark:border-slate-800/80`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-200/50 dark:border-slate-800/60 app-drag cursor-move select-none shrink-0">
          <div className="flex items-center gap-1.5">
            <img src="./icon.png" alt="FluffyWork" className="w-5 h-5 rounded-md object-cover shadow-2xs shrink-0" />
            <div>
              <h1 className="font-extrabold text-xs tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1">
                FluffyWork
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 border border-indigo-100 dark:border-indigo-900/40">
                  {DAY_LABELS[todayKey]} ({todayWorkType !== "normal" ? `${WORK_TYPE_LABELS[todayWorkType].label} ` : ""}{targetHoursToday}h)
                </span>
              </h1>
              <p className="text-[9px] text-slate-400 leading-none">유연근무 타이머</p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-0.5 text-slate-400 app-no-drag">
            {/* Achievements Modal */}
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveModal("achievements");
              }}
              className="p-1 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 hover:text-amber-500 transition-colors"
              title="업적 및 배지"
            >
              <Award size={14} />
            </button>

            {/* Dark/Light toggle */}
            <button
              onClick={() => {
                soundManager.playClick();
                setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
              }}
              className="p-1 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="다크 / 라이트 모드 전환"
            >
              {settings.darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                const next = !settings.soundEnabled;
                soundManager.setMuted(!next);
                if (next) soundManager.playClick();
                setSettings((prev) => ({ ...prev, soundEnabled: next }));
              }}
              className="p-1 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title={settings.soundEnabled ? "효과음 켜짐" : "음소거"}
            >
              {settings.soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>

            {/* Mini Mode Toggle */}
            <button
              onClick={() => {
                soundManager.playClick();
                handleSetViewMode("mini");
              }}
              className="p-1 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="미니 모드로 축소"
            >
              <Minimize2 size={14} />
            </button>

            {/* Settings Modal */}
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveModal("settings");
              }}
              className="p-1 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="설정"
            >
              <Settings size={14} />
            </button>

            {/* Electron Frameless Window Controls */}
            {isElectron && (
              <>
                <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-700 mx-0.5" />
                <button
                  onClick={() => window.electronAPI.minimize()}
                  className="p-1 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  title="최소화"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => window.electronAPI.close()}
                  className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-500 transition-colors"
                  title="닫기"
                >
                  <X size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Widget Body: Optional Left Dock + Main Timer Area */}
        <div className={`flex items-center ${hasDockSlots ? "gap-2.5" : "justify-center"} flex-1 my-auto`}>
          {/* Left Dock Bar (0 items removes dock entirely) */}
          {hasDockSlots && (
            <DockBar
              dockSlots={settings.dockSlots}
              timerState={timerState}
              remainingSeconds={remainingSeconds}
              todoCount={todos.filter((t) => !t.completed).length}
              openModal={(modalName) => setActiveModal(modalName)}
              activeModal={activeModal}
            />
          )}

          {/* Main Circular Timer Center */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <CircularTimer
              timerState={timerState}
              remainingSeconds={remainingSeconds}
              totalTargetSeconds={totalTargetSeconds}
              customImages={customImages}
              pomodoroEnabled={settings.pomodoroEnabled}
              currentCycle={currentCycle}
              totalCycles={settings.pomodoroTotalCycles}
              isRestPeriod={isRestPeriod}
            />

            {/* Main Controller Bar */}
            <div className="flex items-center gap-1.5 mt-1.5">
              {/* Play / Resume / Clock In Button */}
              {timerState === "FOCUS" || timerState === "REST" ? (
                <button
                  onClick={handlePause}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs flex items-center gap-1 shadow-sm shadow-amber-500/20 transition-all"
                >
                  <Pause size={12} />
                  <span>일시정지</span>
                </button>
              ) : (
                <button
                  onClick={handleClockIn}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs flex items-center gap-1 shadow-sm shadow-emerald-500/20 transition-all"
                >
                  <Play size={12} className="ml-0.5" />
                  <span>{timerState === "PAUSED" ? "재개하기" : "출근하기"}</span>
                </button>
              )}

              {/* Clock Out Button */}
              <button
                onClick={() => handleClockOut(false)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all"
              >
                <Square size={11} />
                <span>퇴근</span>
              </button>
            </div>

            {/* Quick Daily Target & Clock In / Out info */}
            <div className="mt-1.5 flex flex-col items-center justify-center gap-0.5 text-[9.5px] select-none text-slate-400">
              {/* Row 1: 출근 시각 & 목표 */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setActiveModal("clockInEdit");
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 group transition-colors cursor-pointer"
                  title="클릭하여 출근 시각 및 오늘 근무 형태(반차 등) 변경"
                >
                  <span className="text-slate-400">출근:</span>
                  <strong className="text-slate-600 dark:text-slate-300 font-medium group-hover:underline">
                    {clockInTime ? formatTo12Hour(clockInTime) : "미등록"}
                  </strong>
                  <Edit2 size={8.5} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </button>

                <span className="text-slate-300 dark:text-slate-600">•</span>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setActiveModal("clockInEdit");
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 group transition-colors cursor-pointer"
                  title="클릭하여 오늘 근무 형태(반차 등) 변경"
                >
                  <span className="text-slate-400">목표:</span>
                  <strong className="text-slate-600 dark:text-slate-300 font-medium group-hover:underline">
                    {targetHoursToday}시간{todayWorkType !== "normal" ? ` (${WORK_TYPE_LABELS[todayWorkType]?.short || todayWorkType})` : ""}
                  </strong>
                  <Edit2 size={8.5} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </button>
              </div>

              {/* Row 2: 출근 시간 바로 밑에 퇴근 시간 표시 */}
              <div className="flex items-center gap-1">
                {timerState === "COMPLETED" && clockOutTime ? (
                  <span className="flex items-center gap-1 text-pink-600 dark:text-pink-400 font-semibold">
                    <span>🎉 퇴근:</span>
                    <strong>{formatTo12Hour(clockOutTime)}</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setActiveModal("clockInEdit");
                    }}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 group transition-colors cursor-pointer"
                    title="클릭하여 출근 시각 및 예상 퇴근 시간 상세 확인"
                  >
                    <span className="text-slate-400">퇴근 예정:</span>
                    <strong className="text-slate-600 dark:text-slate-300 font-medium group-hover:underline">
                      {formattedEstimatedClockOut || "오후 6:00"}
                    </strong>
                    <Edit2 size={8.5} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Todo Flyout (when opened via dock) */}
        {activeModal === "todo" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 bg-black/40 dark:bg-black/60 rounded-[28px] overflow-hidden animate-fadeIn">
            <TodoList todos={todos} setTodos={setTodos} onClose={() => setActiveModal(null)} />
          </div>
        )}
      </div>

      {/* Mascot Settings Modal */}
      {activeModal === "mascot" && (
        <MascotSettingsModal
          customImages={customImages}
          setCustomImages={setCustomImages}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Achievements Modal */}
      {activeModal === "achievements" && (
        <AchievementsModal achievements={achievements} onClose={() => setActiveModal(null)} />
      )}

      {/* Weekly Stats Modal */}
      {activeModal === "stats" && (
        <WeeklyStatsModal
          weeklyData={weeklyData}
          weekdayHours={settings.weekdayHours}
          onReset={() => setWeeklyData({ mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 })}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* General Settings Modal */}
      {activeModal === "settings" && (
        <SettingsModal settings={settings} setSettings={setSettings} onClose={() => setActiveModal(null)} />
      )}

      {/* Clock-In Time & Work Type Edit Modal */}
      {activeModal === "clockInEdit" && (
        <ClockInEditModal
          currentClockInTime={clockInTime}
          elapsedSeconds={elapsedSeconds}
          timerState={timerState}
          settings={settings}
          currentWorkType={todayWorkType}
          baseTargetHours={baseTargetHours}
          onSave={handleSaveClockInTime}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Celebration Summary Modal */}
      {celebrationModalVisible && celebrationSummary && (
        <CelebrationModal
          summary={celebrationSummary}
          customImages={customImages}
          onClose={() => setCelebrationModalVisible(false)}
          onViewStats={() => {
            setCelebrationModalVisible(false);
            setActiveModal("stats");
          }}
        />
      )}

      {/* 5-Min Warning Toast Notification (Rendered on top of all modals) */}
      {warningToastVisible && <WarningToast onClose={() => setWarningToastVisible(false)} />}
    </div>
  );
}
