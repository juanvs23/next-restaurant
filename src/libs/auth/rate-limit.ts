const attempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function key(email: string, ip: string): string {
  return `${email}|${ip}`;
}

export function checkRateLimit(email: string, ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const k = key(email, ip);
  const now = Date.now();
  const entry = attempts.get(k);

  if (!entry || now >= entry.resetAt) {
    attempts.set(k, { count: 0, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS, resetIn: WINDOW_MS };
  }

  const remaining = MAX_ATTEMPTS - entry.count;
  const resetIn = entry.resetAt - now;

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, resetIn };
  }

  return { allowed: true, remaining, resetIn };
}

export function recordFailedAttempt(email: string, ip: string): void {
  const k = key(email, ip);
  const now = Date.now();
  const entry = attempts.get(k);

  if (!entry || now >= entry.resetAt) {
    attempts.set(k, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count++;
  }
}

export function resetRateLimit(email: string, ip: string): void {
  attempts.delete(key(email, ip));
}
