# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Documentation site for the WildDuck Mail Server, built with Docusaurus 3.7. Deployed to GitHub Pages at docs.wildduck.email. Owned by Zone Media (zone-eu).

- **WildDuck source code:** `../wildduck` — read its `CLAUDE.md` for the actual project structure and components
- **Live site domain:** `docs.wildduck.email` — e.g. docs intro is at `https://docs.wildduck.email/docs/getting-started/introduction`

## Commands

```bash
# Install dependencies
npm ci

# Generate OpenAPI docs (required before build/start if docs/wildduck-api/ doesn't exist)
npm run gen-api-docs all

# Local dev server
npm run start

# Production build
npm run build

# Serve production build locally
npm run serve

# Clean Docusaurus cache
npm run clear

# Clean generated API docs
npm run clean-api-docs all
```

**Important:** The OpenAPI MDX files must be generated before building. The `docs/wildduck-api/` directory is generated from a remote OpenAPI spec and should not be manually edited. If the build fails with missing sidebar errors, run `npm run gen-api-docs all` first.

## Architecture

- **Docusaurus config:** `docusaurus.config.ts` — site metadata, navbar, footer, plugin config
- **Sidebars:** `sidebars.ts` — two sidebars: `docsSidebar` (manually structured) and `openApiSidebar` (auto-generated from `docs/wildduck-api/sidebar.js`)
- **Manual docs:** `docs/` — markdown content organized by category (getting-started, architecture, api, security, operations, concepts, ecosystem)
- **Generated API docs:** `docs/wildduck-api/` — auto-generated from the WildDuck OpenAPI spec hosted on GitHub (zone-eu/wildduck repo). Do not edit these files directly.
- **Custom pages:** `src/pages/` — homepage (`index.js`) renders a hero + features + MDX content from `main-page.md`
- **Components:** `src/components/HomepageFeatures/` — feature cards on homepage
- **Styling:** `src/css/custom.css` — Infima overrides, Montserrat font, OpenAPI method label colors

## Key Plugins

- `docusaurus-plugin-openapi-docs` + `docusaurus-theme-openapi-docs` — generates interactive API documentation from OpenAPI spec
- `docusaurus-lunr-search` — client-side search
- `@docusaurus/plugin-client-redirects` — client-side redirects for old URLs (GitHub Pages has no server-side redirects)

## Code Style

- Prettier: 160 char width, 4-space indent, single quotes, LF line endings, no trailing commas
- ESLint: extends `prettier` and `plugin:@docusaurus/recommended`
- React components use JSX in `.js` files (not `.tsx`)
- Config files (`docusaurus.config.ts`, `sidebars.ts`) use TypeScript

## Deployment

GitHub Actions workflow (`.github/workflows/deploy-pages-docs.yml`) deploys on push to `main` and monthly on the 1st (to pick up upstream API spec changes). Uses Node 20.
