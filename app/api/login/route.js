import { NextResponse } from "next/server";
import { checkPassword, hasAdminCredentials, SESSION_COOKIE, sessionToken } from "@/lib/auth";

export async function POST(req) {
  if (!hasAdminCredentials()) {
    return NextResponse.json({ error: "Admin login is not configured for production." }, { status: 503 });
  }
  const { password } = await req.json().catch(() => ({}));
  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
