# bryanward.dev — AGENTS.md

## Quick start

```sh
npm run dev       # astro dev --host (network exposed)
npm run build     # astro check && astro build (typecheck + build)
npm run preview   # astro preview
```

## Architecture

- **Astro v5** site with `@astrojs/react`, `@astrojs/mdx`, `@astrojs/sitemap`
- Desktop view is a faux OS (window management, dock, app bar) — rendered client-side via `client:media="(min-width: 769px)"`
- Mobile gets a separate `HeroDashboard` component
- State: Zustand store (`src/stores/osStore.js`), persisted to localStorage under key `portfolio-os-settings`
- Terminal: React component with custom commands in `src/terminal/commands.jsx`; auto-opens on boot via `boot:complete` event
- 3D wallpapers: `ParticleField`, `DigitalRain`, `HexField` (Three.js / react-three-fiber)
- Content: Astro collections in `src/content/` — `blog` (title, date, description, tags?) and `projects` (title, date, description, tags, optional url/repo/featured), schema at `src/content/config.ts`
- Layouts in `src/layouts/`, pages in `src/pages/`, components in `src/components/` (React/JSX or Astro)

## Deployment

- Push to `main` → GitHub Actions deploys to GitHub Pages (`.github/workflows/deploy.yml`)
- `.nojekyll` present for GH Pages compatibility
- Build artifact: `dist/`
- **No auto-deploy preview for branches** — merge to main first

## Conventions

- No test framework configured; no linter or formatter
- TypeScript via `astro/tsconfigs/strict` — `astro check` validates during build
- JSX in `.jsx` files (not `.tsx`), store is plain `.js`
- CSS custom properties in `src/styles/themes.css` — theming via `data-theme` attribute on `<html>`
- All icons live in `public/img/icons/`
- Windows defined in osStore with explicit position/size/zIndex per app ID
