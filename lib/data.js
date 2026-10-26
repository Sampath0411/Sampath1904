import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

function file(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

export function readJSON(name) {
  return JSON.parse(fs.readFileSync(file(name), "utf8"));
}

export function writeJSON(name, data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(file(name), JSON.stringify(data, null, 2) + "\n", "utf8");
}

export function getSite() {
  return readJSON("site");
}

export function getProjects() {
  return readJSON("projects");
}

export function getProjectBySlug(slug) {
  return getProjects().find((p) => p.slug === slug) || null;
}

export function getProjectById(id) {
  return getProjects().find((p) => p.id === id) || null;
}

export function saveSite(data) {
  writeJSON("site", data);
}

export function saveProjects(projects) {
  writeJSON("projects", projects);
}

/* ---------- messages (contact form) ---------- */

export function getMessages() {
  try {
    return readJSON("messages");
  } catch {
    return [];
  }
}

export function saveMessages(messages) {
  writeJSON("messages", messages);
}

/* ---------- uploads ---------- */

export function uploadDir() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  return UPLOAD_DIR;
}

export function safeFileName(original) {
  const ext = path.extname(original).toLowerCase().replace(/[^a-z0-9.]/g, "");
  const base = path
    .basename(original, path.extname(original))
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
  return `${Date.now()}-${base || "image"}${ext || ".jpg"}`;
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function newId(prefix = "p") {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
