import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const section = await readFile(new URL("../components/sections/LanyardSection.js", import.meta.url), "utf8");
const hero = await readFile(new URL("../components/sections/Hero.js", import.meta.url), "utf8");
const component = await readFile(new URL("../components/reactbits/Lanyard.js", import.meta.url), "utf8");
const back = await readFile(new URL("../public/assets/sampath-id-back.svg", import.meta.url), "utf8");
const strap = await readFile(new URL("../public/assets/sampath-lanyard-strap.svg", import.meta.url), "utf8");
const portrait = new URL("../public/assets/sampath-id-portrait.jpeg", import.meta.url);

test("lanyard badge uses the supplied portrait on its front and preserves the back", async () => {
  await access(portrait);
  assert.match(section, /frontImage="\/assets\/sampath-id-portrait\.jpeg"/);
  assert.match(section, /backImage="\/assets\/sampath-id-back\.svg"/);
  assert.match(section, /strapImage="\/assets\/sampath-lanyard-strap\.svg"/);
  assert.match(section, /flipSignal=\{isFlipped\}/);
  assert.match(section, /aria-pressed=\{isFlipped\}/);
  assert.match(section, /Flip card/);
  assert.match(component, /flipSignal/);
  assert.match(back, /Sampath Satya/);
  assert.match(back, />Saran</);
  assert.match(back, /Andhra University/);
  assert.match(back, /2nd Year/);
  assert.match(strap, /SAMPATH/);
  assert.match(section, /hoverEffect="repel"/);
  assert.match(hero, /hoverEffect="repel"/);
});
