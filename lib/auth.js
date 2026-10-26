import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "admin_session";

const PASSWORD = () => process.env.ADMIN_PASSWORD || "admin123";
const SECRET = () => process.env.AUTH_SECRET || "portfolio-dev-secret-change-me";

export function sessionToken() {
  return crypto.createHash("sha256").update(`${PASSWORD()}::${SECRET()}`).digest("hex");
}

export function checkPassword(password) {
  const a = Buffer.from(String(password ?? ""));
  const b = Buffer.from(PASSWORD());
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function isValidToken(token) {
  if (!token) return false;
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
