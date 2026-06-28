/**
 * Safely get an item from localStorage.
 * Returns `null` if SSR, storage is unavailable, or the key doesn't exist.
 */
export function safeGetItem<T = string>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
}

/**
 * Safely set an item in localStorage.
 * Silently fails if SSR or storage throws (quota, etc.).
 */
export function safeSetItem(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail — quota exceeded or storage unavailable
  }
}
