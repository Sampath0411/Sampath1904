import crypto from "crypto";
import { cookies } from "next/headers";
import { resolveAdminCredentials } from "@/lib/auth-config";

export const SESSION_COOKIE = "admin_session";

export const hasAdminCredentials = () => resolveAdminCredentials().configured;

export function sessionToken() {
  const config = resolveAdminCredentials();
  if (!config.configured) return "";
  return crypto.createHash("sha256").update(`${config.password}::${config.secret}`).digest("hex");
}

export function checkPassword(password) {
  const config = resolveAdminCredentials();
  if (!config.configured) return false;
  const a = Buffer.from(String(password ?? ""));
  const b = Buffer.from(config.password);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function isValidToken(token) {
  if (!token) return false;
  if (!hasAdminCredentials()) return false;
  const expected = sessionToken();
  const t = Buffer.from(String(token));
  const e = Buffer.from(expected);
  if (t.length !== e.length) return false;
  return crypto.timingSafeEqual(t, e);
}

export async function isAuthenticated() {
  const store = await cookies();
  return isValidToken(store.get(SESSION_COOKIE)?.value);
}
