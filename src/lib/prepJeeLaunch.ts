export const PREPJEE_URL = "https://prepjeetests.vercel.app/";

// Nov 8, 2026 in India Standard Time (UTC+05:30), represented as UTC instants.
export const DIWALI_GREETING_START = Date.UTC(2026, 10, 7, 18, 0, 0);
export const DIWALI_GREETING_END = Date.UTC(2026, 10, 8, 6, 0, 0);
export const PREPJEE_LAUNCH_AT = Date.UTC(2026, 10, 8, 14, 0, 0);

export const isDiwaliGreetingActive = (nowMs: number): boolean =>
  nowMs >= DIWALI_GREETING_START && nowMs < DIWALI_GREETING_END;

export const isPrepJeeLive = (nowMs: number): boolean => nowMs >= PREPJEE_LAUNCH_AT;

export const getPrepJeeTimeRemaining = (nowMs: number): number =>
  Math.max(0, PREPJEE_LAUNCH_AT - nowMs);

export const formatCountdown = (remainingMs: number): string => {
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};