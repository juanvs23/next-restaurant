/**
 * Map common IANA timezone names to UTC offset strings.
 * Used as fallback when no explicit timezone is provided.
 */
const TZ_MAP: Record<string, string> = {
  "America/Caracas": "-04:00",
  "America/Bogota": "-05:00",
  "America/Lima": "-05:00",
  "America/Mexico_City": "-06:00",
  "America/New_York": "-05:00",
  "America/Chicago": "-06:00",
  "America/Denver": "-07:00",
  "America/Los_Angeles": "-08:00",
  "America/Argentina/Buenos_Aires": "-03:00",
  "America/Santiago": "-04:00",
  "America/Sao_Paulo": "-03:00",
  "Europe/London": "+00:00",
  "Europe/Berlin": "+01:00",
  "Europe/Paris": "+01:00",
  "Europe/Madrid": "+01:00",
  "Asia/Tokyo": "+09:00",
  "Asia/Shanghai": "+08:00",
  "Asia/Dubai": "+04:00",
  "Australia/Sydney": "+10:00",
  "Pacific/Auckland": "+12:00",
};

/**
 * Get the default timezone from the server's TZ env variable, or fall back to -04:00.
 */
export function getDefaultTimezone(): string {
  if (process.env.TZ && TZ_MAP[process.env.TZ]) {
    return TZ_MAP[process.env.TZ];
  }
  return "-04:00";
}

/**
 * Parse timezone offset string like "-04:00" to milliseconds.
 */
export function tzOffsetMs(tz: string): number {
  const sign = tz.startsWith("-") ? -1 : 1;
  const parts = tz.replace(/[+-]/, "").split(":");
  const hours = parseInt(parts[0] || "0");
  const mins = parseInt(parts[1] || "0");
  return sign * (hours * 60 + mins) * 60 * 1000;
}

/**
 * Get the local start and end of a day for a given timezone.
 *
 * @param dateStr - "2026-06-23"
 * @param timezone - "-04:00" (defaults to env TZ or -04:00)
 * @returns { start: Date, end: Date } — UTC Date objects representing
 *          the local midnight-to-midnight range in the given timezone.
 */
export function getLocalDayRange(
  dateStr: string,
  timezone?: string
): { start: Date; end: Date } {
  const tz = timezone || getDefaultTimezone();
  const offset = tzOffsetMs(tz);

  const startUtc = new Date(dateStr + "T00:00:00.000Z");
  const start = new Date(startUtc.getTime() - offset);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return { start, end };
}
