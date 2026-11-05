# Badge Interaction and Background Implementation Plan

**Goal:** Keep the draggable ID badge visible during horizontal drags, add a deliberate flip control with Sampath's student details on the reverse, label the lime strap, and make cursor-reactive particles visible through the hero and badge section.

**Architecture:** Retain the existing Three.js lanyard. Constrain pointer-driven targets and free-swing physics with enough travel room to keep the card visible without making it feel pinned. Render the reverse from a custom SVG with the supplied name, college, and year, and use a star-framed name tile for the lime strap. Render the original-strength global fluid cursor on a fixed viewport canvas using viewport coordinates so it works across scroll positions; keep particles reactive behind the badge and hero.

**Tech Stack:** Next.js 16, React, Three.js, CSS, Node test runner.

## Work items

1. Add failing unit coverage for drag-bound calculation and badge content/flip wiring.
2. Implement dimension-aware drag bounds and test them.
3. Add the explicit flip button, back-of-card identity layout, and star/name strap artwork.
4. Add pointer-reactive particles behind the badge and ensure the hero cursor/particle treatment stays visible across the text area.
5. Run the full test suite and production build; verify desktop/mobile behavior in the running site.
