# Project Card Images Design

## Goal

Give each of the six recently listed GitHub projects an accurate, project-specific image on the portfolio work page and project detail page.

## Image sources

- **Glance for Windows:** use official product artwork from its GitHub repository.
- **PS26011 3D Building Map:** use an official city-view screenshot from its GitHub repository, replacing the current generic aerial cover if the screenshot is clearer at card size.
- **DevSocio, ResumePulse, AgriShield AI, and Swiggy LifeOS:** capture screenshots from their linked project demos.
- Do not hotlink Google Images or use unrelated stock imagery. If a project demo or official asset is unavailable or misleading, stop and report the gap rather than substituting a generic image.

## Implementation

- Store selected images locally under `public/assets/projects/` so the portfolio does not depend on third-party image hosting.
- Update only the matching project records in `data/projects.json`; keep existing titles, descriptions, links, and featured status unchanged.
- Set concise, meaningful `imageAlt` text that identifies the relevant project view.
- Use consistent landscape crops suitable for both project cards and the larger detail-page cover.

## Verification

- Check every local image exists and can be served by the app.
- Run the project tests and production build.
- Use a browser check on `/work` and each affected detail page to confirm the correct image is visible and has useful alt text.
- Preserve unrelated untracked files in the working tree.

## Out of scope

- Redesigning the project cards or detail-page layout.
- Adding external image-search results, attributions, or new image-hosting services.
- Changing project copy, links, or which projects are featured on the home page.
