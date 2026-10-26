import fs from "fs";
import path from "path";
import { createSupabaseClient, getSupabaseConfig } from "@/lib/supabase";
import { createPortfolioStore } from "@/lib/portfolio-store";

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

function dataStore() {
  const config = getSupabaseConfig();
  const client = config ? createSupabaseClient() : null;
  return createPortfolioStore({
    client,
    local: { read: readJSON, write: writeJSON },
    production: process.env.NODE_ENV === "production",
  });
}

export async function getSite() {
  return dataStore().getSite();
}

export async function getProjects(options) {
  return dataStore().getProjects(options);
}

export async function getProjectBySlug(slug) {
  return (await getProjects({ publishedOnly: true })).find((project) => project.slug === slug) || null;
}

export async function getProjectById(id) {
  return (await getProjects({ publishedOnly: true })).find((project) => project.id === id) || null;
}

export async function saveSite(data) {
  return dataStore().saveSite(data);
}

export async function saveProjects(projects) {
  return dataStore().saveProjects(projects);
}

/* ---------- messages (contact form) ---------- */

export async function getMessages() {
  return dataStore().getMessages();
}

export async function addMessage(message) {
  return dataStore().addMessage(message);
}

export async function deleteMessage(id) {
  return dataStore().deleteMessage(id);
}

export async function consumeContactLimit(ipHash) {
  return dataStore().consumeContactLimit(ipHash);
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
