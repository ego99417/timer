/**
 * @file src/utils/timeFormat.js
 * @description 시간 및 날짜 포맷 변환 유틸리티 함수 모음
 * 
 * [주요 역할]
 * - 초(seconds)를 "HH:MM:SS" 또는 "M시간 S분" 형태로 가공
 * - 24시간제(09:30)와 한국어 12시간제(오전 9:30) 상호 변환 및 파싱
 * - 출근 시간 수정 모달 및 타이머 게이지 계산에 활용
 */

/**
 * Formats a Date or time string into Korean 12-hour format: "오전/오후 H:MM"
 * Examples:
 * - 09:30:00 -> "오전 9:30"
 * - 16:25:00 -> "오후 4:25"
 * - 12:00:00 -> "오후 12:00"
 * - 00:15:00 -> "오전 12:15"
 */
export function formatTo12Hour(input) {
  if (!input) return "";

  // If already formatted like "오전 9:30" or "오후 4:25", return as is
  if (typeof input === "string" && (input.startsWith("오전 ") || input.startsWith("오후 "))) {
    return input;
  }

  let hours = 0;
  let minutes = 0;

  if (input instanceof Date) {
    hours = input.getHours();
    minutes = input.getMinutes();
  } else if (typeof input === "string") {
    // Check if format is "HH:mm:ss" or "HH:mm"
    const parts = input.split(":");
    if (parts.length >= 2 && !isNaN(parseInt(parts[0], 10)) && !isNaN(parseInt(parts[1], 10))) {
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1], 10);
    } else {
      const parsedDate = new Date(input);
      if (!isNaN(parsedDate.getTime())) {
        hours = parsedDate.getHours();
        minutes = parsedDate.getMinutes();
      } else {
        return input;
      }
    }
  } else {
    return "";
  }

  const period = hours >= 12 ? "오후" : "오전";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = minutes.toString().padStart(2, "0");

  return `${period} ${displayHours}:${displayMinutes}`;
}

/**
 * Parses a 12-hour string (e.g. "오후 4:25") or 24-hour string ("16:25") into { hours24, minutes, period, hours12 }
 */
export function parse12HourTime(timeStr) {
  const now = new Date();
  if (!timeStr) {
    const h24 = now.getHours();
    const mins = now.getMinutes();
    return {
      period: h24 >= 12 ? "오후" : "오전",
      hours12: h24 % 12 === 0 ? 12 : h24 % 12,
      hours24: h24,
      minutes: mins,
    };
  }

  if (timeStr.startsWith("오전 ") || timeStr.startsWith("오후 ")) {
    const period = timeStr.startsWith("오후 ") ? "오후" : "오전";
    const rawTime = timeStr.replace(/^(오전|오후)\s+/, "");
    const [hStr, mStr] = rawTime.split(":");
    const h12 = parseInt(hStr, 10) || 12;
    const mins = parseInt(mStr, 10) || 0;
    let h24 = h12 % 12;
    if (period === "오후") h24 += 12;

    return {
      period,
      hours12: h12,
      hours24: h24,
      minutes: mins,
    };
  }

  // Fallback 24-hour string "HH:mm"
  const parts = timeStr.split(":");
  const h24 = parseInt(parts[0], 10) || 0;
  const mins = parseInt(parts[1], 10) || 0;
  return {
    period: h24 >= 12 ? "오후" : "오전",
    hours12: h24 % 12 === 0 ? 12 : h24 % 12,
    hours24: h24,
    minutes: mins,
  };
}

/**
 * Calculates net worked seconds between clockInDate and now,
 * automatically deducting lunch break time if autoLunchBreak is enabled.
 * 
 * @param {Date} clockInDate - The clock-in Date object
 * @param {Date} now - Current Date object (defaults to new Date())
 * @param {Object} lunchSettings - { autoLunchBreak: boolean, lunchStart: "HH:mm", lunchEnd: "HH:mm" }
 * @returns {{ netWorkedSeconds: number, lunchDeductedSeconds: number }}
 */
export function calculateWorkedSecondsWithLunch(clockInDate, now = new Date(), lunchSettings = {}) {
  if (!clockInDate || isNaN(clockInDate.getTime())) {
    return { netWorkedSeconds: 0, lunchDeductedSeconds: 0 };
  }

  const clockInMs = clockInDate.getTime();
  const nowMs = now.getTime();

  if (nowMs <= clockInMs) {
    return { netWorkedSeconds: 0, lunchDeductedSeconds: 0 };
  }

  const rawDiffMs = nowMs - clockInMs;
  let lunchOverlapMs = 0;

  const { autoLunchBreak, lunchStart, lunchEnd } = lunchSettings;

  if (autoLunchBreak && lunchStart && lunchEnd) {
    const [startH, startM] = lunchStart.split(":").map(Number);
    const [endH, endM] = lunchEnd.split(":").map(Number);

    if (!isNaN(startH) && !isNaN(startM) && !isNaN(endH) && !isNaN(endM)) {
      const lunchStartDate = new Date(now);
      lunchStartDate.setHours(startH, startM, 0, 0);
      const lunchEndDate = new Date(now);
      lunchEndDate.setHours(endH, endM, 0, 0);

      const lunchStartMs = lunchStartDate.getTime();
      const lunchEndMs = lunchEndDate.getTime();

      if (lunchEndMs > lunchStartMs) {
        // Overlap between [clockInMs, nowMs] and [lunchStartMs, lunchEndMs]
        const overlapStart = Math.max(clockInMs, lunchStartMs);
        const overlapEnd = Math.min(nowMs, lunchEndMs);

        if (overlapEnd > overlapStart) {
          lunchOverlapMs = overlapEnd - overlapStart;
        }
      }
    }
  }

  const netWorkedSeconds = Math.max(0, Math.round((rawDiffMs - lunchOverlapMs) / 1000));
  const lunchDeductedSeconds = Math.round(lunchOverlapMs / 1000);

  return { netWorkedSeconds, lunchDeductedSeconds };
}

/**
 * Calculates estimated clock-out Date based on clockInDate, targetHours, lunch break, and workTypePreset settings.
 * 
 * If workTypePreset has clockIn and clockOut configured in Settings (e.g. 09:00 ~ 13:00 for afternoon half-day):
 * It uses the preset's clockOut shifted by any difference in actual clock-in time!
 * 
 * @param {Date} clockInDate - The clock-in Date object
 * @param {number} targetHours - Target work hours (e.g. 8, 4, 6)
 * @param {Object} options - { autoLunchBreak: boolean, lunchStart: "HH:mm", lunchEnd: "HH:mm", workTypePreset?: { clockIn: string, clockOut: string, hours: number } }
 * @returns {Date | null}
 */
export function calculateEstimatedClockOut(clockInDate, targetHours, options = {}) {
  if (!clockInDate || isNaN(clockInDate.getTime())) return null;

  const { autoLunchBreak, lunchStart, lunchEnd, workTypePreset, isNormalWork } = options;

  // 1. If it's a specific shift preset (half_am, half_pm, quarter) and has preset clockIn & clockOut:
  // Base calculation directly on preset.clockOut shifted by actual clock-in delta!
  if (!isNormalWork && workTypePreset?.clockIn && workTypePreset?.clockOut) {
    const [pInH, pInM] = workTypePreset.clockIn.split(":").map(Number);
    const [pOutH, pOutM] = workTypePreset.clockOut.split(":").map(Number);

    if (!isNaN(pInH) && !isNaN(pInM) && !isNaN(pOutH) && !isNaN(pOutM)) {
      const presetInDate = new Date(clockInDate);
      presetInDate.setHours(pInH, pInM, 0, 0);

      const presetOutDate = new Date(clockInDate);
      presetOutDate.setHours(pOutH, pOutM, 0, 0);

      if (presetOutDate > presetInDate) {
        // Delta between actual/selected clock-in and preset scheduled clock-in
        const clockInDeltaMs = clockInDate.getTime() - presetInDate.getTime();
        return new Date(presetOutDate.getTime() + clockInDeltaMs);
      }
    }
  }

  // 2. Normal work (or fallback): calculate based on targetHours + lunch break overlap
  if (!targetHours || targetHours <= 0) return null;
  const targetSec = targetHours * 3600;
  let clockOutMs = clockInDate.getTime() + targetSec * 1000;

  if (autoLunchBreak && lunchStart && lunchEnd) {
    const [startH, startM] = lunchStart.split(":").map(Number);
    const [endH, endM] = lunchEnd.split(":").map(Number);

    if (!isNaN(startH) && !isNaN(startM) && !isNaN(endH) && !isNaN(endM)) {
      const lunchStartDate = new Date(clockInDate);
      lunchStartDate.setHours(startH, startM, 0, 0);
      const lunchEndDate = new Date(clockInDate);
      lunchEndDate.setHours(endH, endM, 0, 0);

      const lunchStartMs = lunchStartDate.getTime();
      const lunchEndMs = lunchEndDate.getTime();

      // If work period overlaps with the lunch break, add the lunch duration
      if (clockInDate.getTime() < lunchEndMs && clockOutMs > lunchStartMs) {
        const lunchDurationMs = Math.max(0, lunchEndMs - lunchStartMs);
        clockOutMs += lunchDurationMs;
      }
    }
  }

  return new Date(clockOutMs);
}

/**
 * Calculates net worked hours between "HH:mm" start and "HH:mm" end, deducting lunch break if applicable.
 */
export function calculateNetHoursBetween(clockInStr, clockOutStr, lunchSettings = {}) {
  if (!clockInStr || !clockOutStr) return 8;
  const [inH, inM] = clockInStr.split(":").map(Number);
  const [outH, outM] = clockOutStr.split(":").map(Number);
  if (isNaN(inH) || isNaN(inM) || isNaN(outH) || isNaN(outM)) return 8;

  const dIn = new Date();
  dIn.setHours(inH, inM, 0, 0);

  const dOut = new Date();
  dOut.setHours(outH, outM, 0, 0);

  if (dOut <= dIn) {
    return 0;
  }

  const { netWorkedSeconds } = calculateWorkedSecondsWithLunch(dIn, dOut, lunchSettings);
  return Math.round((netWorkedSeconds / 3600) * 10) / 10;
}
