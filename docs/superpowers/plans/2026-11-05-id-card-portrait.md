# ID Card Portrait Implementation Plan

> **For agentic workers:** Use the executing-plans skill to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show the supplied portrait on the front of the existing lanyard badge and run the portfolio locally.

**Architecture:** Preserve the source by copying it to a new file in `public/assets/`; update only the `frontImage` prop in `components/sections/LanyardSection.js`. Leave the existing back image and badge presentation unchanged, then verify and start the Next.js development server.

**Tech Stack:** Next.js 16, React, Three.js, npm.

---

### Task 1: Add the portrait to the badge

**Files:**
- Create: `public/assets/sampath-id-portrait.jpeg` (copy from `C:\Users\sampa\Downloads\Images\WhatsApp Image 2026-06-07 at 12.27.09 PM.jpeg`)
- Modify: `components/sections/LanyardSection.js`

- [ ] **Step 1: Read the relevant installed Next.js guide**

Read the docs under `node_modules/next/dist/docs/` for the app router and static assets before editing code, as required by `AGENTS.md`.

- [ ] **Step 2: Copy the portrait without replacing existing assets**

Copy the supplied JPEG to `public/assets/sampath-id-portrait.jpeg`. Confirm the new file exists and is non-empty.

- [ ] **Step 3: Point only the badge front at the new asset**

In `components/sections/LanyardSection.js`, change the existing prop to:

```jsx
frontImage="/assets/sampath-id-portrait.jpeg"
```

Do not modify `backImage` or the badge settings.

- [ ] **Step 4: Verify the change**

Run `npm test` and `npm run build`. Confirm both succeed; inspect `git diff -- components/sections/LanyardSection.js` and make sure unrelated existing modifications remain untouched.

### Task 2: Run the website

**Files:**
- No additional source files.

- [ ] **Step 1: Start the development server**

Run `npm run dev` from `C:\Users\sampa\Downloads\uj`. If port 3000 is occupied, use the next port Next.js selects and report that URL.

- [ ] **Step 2: Confirm the site and image are served**

Open/check the local homepage and request `/assets/sampath-id-portrait.jpeg`. Report the URL and any verification limitations.
