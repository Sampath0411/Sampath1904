export function getSupabaseConfig(env = process.env) {
  const rawUrl = String(env.SUPABASE_URL || "").trim();
  const serviceRoleKey = String(env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!rawUrl && !serviceRoleKey) return null;
  if (!rawUrl || !serviceRoleKey) {
    throw new Error("Both SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  }

  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("SUPABASE_URL must be a valid HTTPS URL.");
  }
  if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    throw new Error("SUPABASE_URL must be a valid HTTPS URL.");
  }
  return { url: url.origin, serviceRoleKey };
}

export function createSupabaseClient(env = process.env, fetchImpl = fetch) {
  const config = getSupabaseConfig(env);
  if (!config) throw new Error("Supabase is not configured.");

  return {
    async request(path, options = {}) {
      const normalizedPath = String(path).replace(/^\/+/, "");
      const response = await fetchImpl(`${config.url}/rest/v1/${normalizedPath}`, {
        ...options,
        headers: {
          apikey: config.serviceRoleKey,
          Authorization: `Bearer ${config.serviceRoleKey}`,
          ...(options.headers || {}),
        },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Supabase request failed (${response.status}).`);
      if (response.status === 204) return null;
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    },
  };
}
