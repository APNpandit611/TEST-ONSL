import type { RequestHandler } from "express";
import type { IncomingHttpHeaders } from "http";

// On Vercel/standard deployments Clerk works natively - no proxy needed
export const CLERK_PROXY_PATH = "/api/__clerk";

export function getClerkProxyHost(req: {
  headers: IncomingHttpHeaders;
}): string | undefined {
  const forwarded = req.headers["x-forwarded-host"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const firstHop = raw?.split(",")[0]?.trim();
  return firstHop || req.headers.host?.trim() || undefined;
}

// Simple passthrough - no proxy needed outside Replit
export function clerkProxyMiddleware(): RequestHandler {
  return (_req, _res, next) => next();
}
