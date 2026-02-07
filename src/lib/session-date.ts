// ===== 4AM Session Date Offset =====
// Poker sessions that start after midnight but before 4AM
// are considered part of the "previous" calendar day.
// e.g. A session starting at 2:00 AM on Feb 8 → sessionDate = Feb 7

const SESSION_DAY_CUTOFF_HOUR = 4;

/**
 * Calculate the "session date" from a full datetime.
 * If the time is before 4:00 AM, the date rolls back to the previous day.
 *
 * @param datetime - A Date object or ISO string of the session start
 * @returns YYYY-MM-DD string representing the poker session date
 */
export function getSessionDate(datetime: Date | string): string {
  const d = typeof datetime === "string" ? new Date(datetime) : datetime;
  const hours = d.getHours();

  if (hours < SESSION_DAY_CUTOFF_HOUR) {
    // Before 4AM → belongs to previous day
    d.setDate(d.getDate() - 1);
  }

  return formatDateYMD(d);
}

/**
 * Parse a start time (HH:MM) on a given date, applying the 4AM offset logic.
 * Returns the adjusted session date string.
 *
 * @param date - The calendar date (YYYY-MM-DD)
 * @param startTime - The start time (HH:MM)
 * @returns The adjusted session date (YYYY-MM-DD)
 */
export function getSessionDateFromParts(date: string, startTime: string): string {
  const [hours] = startTime.split(":").map(Number);

  if (hours < SESSION_DAY_CUTOFF_HOUR) {
    // Before 4AM → belongs to previous day
    const d = new Date(date + "T00:00:00");
    d.setDate(d.getDate() - 1);
    return formatDateYMD(d);
  }

  return date;
}

/**
 * Check if a given time is in the "late night" zone (midnight to 4AM).
 * Useful for UI hints like "深夜セッション" badges.
 */
export function isLateNightSession(startTime: string): boolean {
  const [hours] = startTime.split(":").map(Number);
  return hours >= 0 && hours < SESSION_DAY_CUTOFF_HOUR;
}

/**
 * Calculate session duration in minutes, handling overnight sessions.
 * If endTime < startTime, assumes the session crossed midnight.
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  let startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;

  // If end is before start, session crossed midnight
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  return endMinutes - startMinutes;
}

function formatDateYMD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
