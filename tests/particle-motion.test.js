import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { shouldScheduleParticleFrame } from "../lib/particle-motion.js";

test("reduced-motion preference disables recurring particle frames", () => {
  assert.equal(shouldScheduleParticleFrame(true), false);
});

test("normal motion keeps particle frames enabled", () => {
  assert.equal(shouldScheduleParticleFrame(false), true);
});

test("particle cleanup does not destroy the canvas context needed by Strict Mode remounts", async () => {
  const source = await readFile(new URL("../components/reactbits/Particles.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /WEBGL_lose_context[\s\S]{0,80}loseContext\s*\(/);
});
