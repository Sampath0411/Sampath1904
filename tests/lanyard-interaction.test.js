import test from "node:test";
import assert from "node:assert/strict";
import { clampCardAxis, clampDragPoint, getCardDragLimit } from "../lib/lanyard-interaction.js";

test("getCardDragLimit leaves a useful travel range while keeping the badge inside view", () => {
  assert.equal(getCardDragLimit(4, 1), 1.4);
  assert.equal(getCardDragLimit(1, 1), 0);
});

test("clampCardAxis keeps free swinging inside the visible horizontal bounds", () => {
  assert.equal(clampCardAxis(-4, 1.2), -1.2);
  assert.equal(clampCardAxis(0.8, 1.2), 0.8);
  assert.equal(clampCardAxis(4, 1.2), 1.2);
});

test("clampDragPoint keeps the full card inside the canvas on horizontal drags", () => {
  const rect = { left: 100, top: 50, width: 600, height: 620 };
  assert.deepEqual(clampDragPoint(0, 300, rect, 160, 220), { x: 180, y: 300 });
  assert.deepEqual(clampDragPoint(900, 300, rect, 160, 220), { x: 620, y: 300 });
});

test("clampDragPoint keeps the full card inside the canvas on vertical drags", () => {
  const rect = { left: 0, top: 0, width: 600, height: 620 };
  assert.deepEqual(clampDragPoint(300, -20, rect, 160, 220), { x: 300, y: 110 });
  assert.deepEqual(clampDragPoint(300, 900, rect, 160, 220), { x: 300, y: 510 });
});
