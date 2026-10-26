import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { uploadDir } from "@/lib/data";

// Serves uploaded files from data/uploads. Files are written at runtime,
// so they're read from disk per request instead of living in public/.
// We only serve files that exist in the uploads directory (no path traversal).
const ALLOWED_EXT = /\.(jpe?g|png|webp|gif|avif|svg)$/i;

export async function GET(_req, { params }) {
  const { name } = await params;

  // Reject anything that isn't a plain filename (escapes uploadDir, keeps
  // requests to non-upload paths like /uploads/../site.json from working).
  if (!name || typeof name !== "string" || path.basename(name) !== name || !ALLOWED_EXT.test(name)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const full = path.join(uploadDir(), name);
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Serve the buffer directly. `Content-Type` matters for <img> and previews.
  const data = fs.readFileSync(full);
  const ext = path.extname(name).toLowerCase();
  const types = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".avif": "image/avif",
    ".svg": "image/svg+xml",
  };
  return new NextResponse(data, {
    headers: {
      "Content-Type": types[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    },
  });
}