import { headers } from "next/headers";

/**
 * Derives the base URL for server-side fetch calls.
 *
 * Priority:
 * 1. NEXT_PUBLIC_BASE_URL env var (explicit override)
 * 2. x-forwarded-proto + host headers (serverless platforms: Vercel, Fly, etc.)
 * 3. host header + https in production / http in dev
 *
 * Throws if no URL can be derived — no silent localhost fallback.
 */
export async function getBaseUrl(): Promise<string> {
  // 1. Explicit env var
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");

  // 2. Headers-based derivation
  const h = await headers();
  const host = h.get("host");
  if (!host) {
    throw new Error(
      "getBaseUrl: no NEXT_PUBLIC_BASE_URL set and no host header found. " +
        "SSR fetch calls need a base URL. Set NEXT_PUBLIC_BASE_URL in your environment."
    );
  }

  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");

  return `${proto}://${host}`;
}
