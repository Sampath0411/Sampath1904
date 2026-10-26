import { getSupabaseConfig } from "./supabase.js";

const BUCKET = "portfolio-assets";

export function createSupabaseStorage(env = process.env, fetchImpl = fetch) {
  const config = getSupabaseConfig(env);
  if (!config) throw new Error("Supabase is not configured.");

  function publicUrl(name) {
    return `${config.url}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(String(name))}`;
  }

  return {
    publicUrl,
    async upload(name, contentType, buffer) {
      const url = `${config.url}/storage/v1/object/${BUCKET}/${encodeURIComponent(String(name))}`;
      const response = await fetchImpl(url, {
        method: "POST",
        headers: {
          apikey: config.serviceRoleKey,
          Authorization: `Bearer ${config.serviceRoleKey}`,
          "Content-Type": contentType,
          "x-upsert": "true",
        },
        body: buffer,
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Supabase Storage request failed (${response.status}).`);
      return publicUrl(name);
    },
  };
}
