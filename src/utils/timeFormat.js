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
