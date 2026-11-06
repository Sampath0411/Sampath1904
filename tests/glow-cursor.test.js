import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const cursor = await readFile(new URL("../components/reactbits/GlowCursor.js", import.meta.url), "utf8");
const styles = await readFile(new URL("../components/reactbits/GlowCursor.css", import.meta.url), "utf8");
const layout = await readFile(new URL("../app/layout.js", import.meta.url), "utf8");

test("cursor effect uses a viewport-fixed canvas and viewport pointer coordinates", () => {
  assert.match(styles, /\.glow-cursor__canvas\s*\{[^}]*position:\s*fixed/s);
  assert.match(cursor, /const width = window\.innerWidth/);
  assert.match(cursor, /const height = window\.innerHeight/);
  assert.match(cursor, /const x = event\.clientX\s*;/);
  assert.match(cursor, /const y = event\.clientY\s*;/);
});

test("cursor canvas is layered behind page content", () => {
  assert.match(styles, /\.glow-cursor__canvas\s*\{[^}]*z-index:\s*0/s);
  assert.match(styles, /\.glow-cursor__content\s*\{[^}]*z-index:\s*1/s);
});

test("global cursor preserves its original intensity and trail appearance", () => {
  assert.match(layout, /<GlowCursor[^>]*intensity=\{1\.1\}[^>]*trailWidth=\{2\.5\}[^>]*glow=\{0\.9\}[^>]*clickBurst=\{false\}[^>]*grain=\{0\.02\}/s);
  assert.doesNotMatch(layout, /linger=\{0\.3\}|hotspot=\{0\.5\}|followSpeed=\{0\.85\}/);
  assert.doesNotMatch(styles, /opacity:\s*0\.62/);
});
