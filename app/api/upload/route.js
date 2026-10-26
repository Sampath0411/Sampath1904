import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";
import { safeFileName, uploadDir } from "@/lib/data";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
};

export async function POST(req) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED[file.type]) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 415 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image too large (max 8MB)" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = safeFileName(file.name || `image${ALLOWED[file.type]}`);
  // Force the extension to match the validated mime type.
  const finalName = name.replace(/\.[a-z0-9]+$/, "") + ALLOWED[file.type];
  const dest = path.join(uploadDir(), finalName);
  fs.writeFileSync(dest, buffer);

  return NextResponse.json({ url: `/uploads/${finalName}` }, { status: 201 });
}
