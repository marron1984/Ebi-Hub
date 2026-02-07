// ===== Tournament Intelligence & Countdown Logic =====

export interface CountdownResult {
  daysUntil: number;
  hoursUntil: number;
  minutesUntil: number;
  isUrgent: boolean; // < 24 hours
  isPast: boolean;
  label: string; // pre-formatted Japanese label
}

/**
 * Calculate countdown to a tournament or event date.
 * @param targetDate - ISO date string (e.g. "2025-02-15" or "2025-02-15T14:00")
 * @param now - optional reference time as Date or ISO string (defaults to Date.now())
 */
export function calculateCountdown(
  targetDate: string,
  now?: Date | string
): CountdownResult {
  const ref = now ? (typeof now === "string" ? new Date(now) : now) : new Date();
  const target = new Date(targetDate);
  const diffMs = target.getTime() - ref.getTime();

  if (diffMs <= 0) {
    return {
      daysUntil: 0,
      hoursUntil: 0,
      minutesUntil: 0,
      isUrgent: false,
      isPast: true,
      label: "終了",
    };
  }

  const minutesUntil = Math.floor(diffMs / 60000);
  const hoursUntil = Math.floor(diffMs / 3600000);
  const daysUntil = Math.floor(diffMs / 86400000);
  const isUrgent = hoursUntil < 24;

  let label: string;
  if (daysUntil >= 1) {
    label = `あと${daysUntil}日`;
  } else if (hoursUntil >= 1) {
    label = `あと${hoursUntil}時間`;
  } else {
    label = `あと${minutesUntil}分`;
  }

  return {
    daysUntil,
    hoursUntil,
    minutesUntil,
    isUrgent,
    isPast: false,
    label,
  };
}
