export function resolveAdminCredentials(env = process.env) {
  const production = env.NODE_ENV === "production";
  const password = String(env.ADMIN_PASSWORD || (production ? "" : "admin123"));
  const secret = String(env.AUTH_SECRET || (production ? "" : "portfolio-dev-secret-change-me"));
  const configured = production
    ? password.length >= 16 && secret.length >= 32 && password !== "admin123"
    : Boolean(password && secret);

  return { configured, password: configured ? password : "", secret: configured ? secret : "" };
}
