# Project Live Website and GitHub Repo Links

Date: 2026-11-04

## Goal

Let visitors and clients open a project's live website or source repository from the portfolio, and let the admin manage both links.

## Scope

- Add project links only.
- Do not redesign the admin panel.
- Show links on project cards, the work page, the home page, and the project detail page.

## Data model

- Reuse the existing `link` project field as the project's Live Website URL.
- Add `repoUrl` for the GitHub repository URL.
- Both fields are optional and may be blank.
- Persist both in the existing local `data/projects.json` file or the Supabase project `document` JSON.
- Do not add a database column or migration.
- Existing project records remain valid when `repoUrl` is absent.

## Admin behavior

- Rename the existing "External link" field to "Live Website".
- Add a "GitHub Repo" field.
- Validate GitHub URLs on save:
  - accept HTTPS GitHub repository URLs such as `https://github.com/<owner>/<repo>`;
  - permit harmless URL decoration such as trailing slash, `.git`, query parameters, or fragments;
  - reject non-GitHub hosts and malformed URLs;
  - allow a blank value.
- Show a clear validation error without saving invalid input.
- Preserve existing `link` values and relabel them in the UI.

## Public UI

### Project cards

- Keep "View project" as the primary action.
- Add two compact icon buttons:
  - external-link icon for Live Website;
  - GitHub icon for GitHub Repo.
- Render each icon only when its URL is present.
- Open links in a new tab with `rel="noreferrer"`.
- Include accessible labels and tooltips.
- Home and Work use the shared `ProjectCard`, so both receive the same controls.

### Project detail page

- Render "Live Website" when `link` is present.
- Render "GitHub Repo" when `repoUrl` is present.
- Hide missing controls.
- Open external URLs in a new tab with `rel="noreferrer"`.

## API behavior

- Accept and persist `repoUrl` in project create and update routes.
- Normalize allowed URLs before saving.
- Apply the same GitHub validation server-side; client-side validation is only a convenience.
- Continue accepting omitted `repoUrl` as empty.
- Preserve current authentication and project ownership behavior.

## Error handling

- Invalid GitHub URL returns a 400 response and does not mutate stored projects.
- Blank URLs are accepted and render no public control.
- Older records without `repoUrl` render as empty.
- `javascript:` and other non-HTTP(S) URLs are rejected.

## Testing

- Unit-test GitHub URL normalization/validation.
- Cover create and update route payload handling where practical.
- Verify existing project records without `repoUrl` remain valid.
- Manually verify card icon visibility, detail-page buttons, and admin validation.

## Non-goals

- No custom button labels.
- No arbitrary Git hosting providers.
- No project-card redesign beyond the two icon controls.
- No changes to project publishing, featured ordering, or unrelated admin screens.
