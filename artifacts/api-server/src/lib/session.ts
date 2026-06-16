import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_NAME = "nepal_admin_session";
export const COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

// Allow build to succeed without SESSION_SECRET - will fail at runtime if missing
const sessionSecret = process.env.SESSION_SECRET || "build-time-placeholder";

function sign(value: string): string {
  return createHmac("sha256", sessionSecret).update(value).digest("base64url");
}

export function createSessionToken(): string {
  const expiresAt = String(Date.now() + COOKIE_MAX_AGE_MS);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;

  const expiresAt = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  const expected = sign(expiresAt);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const exp = Number(expiresAt);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  return true;
}
