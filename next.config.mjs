import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Uploaded images live in public/uploads and are served as-is.
  images: { unoptimized: true },
  // Pin the project root so Turbopack doesn't walk up into the home directory.
  turbopack: { root: __dirname },
};

export default nextConfig;
