import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const layout = await readFile(new URL("../app/layout.js", import.meta.url), "utf8");
const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("document background is styled in CSS, not hydration-sensitive root inline styles", () => {
  assert.match(layout, /<html\b[^>]*>/);
  assert.doesNotMatch(layout, /<html\b[^>]*\bstyle=/);
  assert.match(layout, /<body\b[^>]*>/);
  assert.doesNotMatch(layout, /<body\b[^>]*\bstyle=/);
  assert.match(styles, /html\s*,\s*body\s*\{[^}]*background-color\s*:\s*#0A0A0A/i);
});
