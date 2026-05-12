# bryanward.dev

Personal website for [Bryan Ward](https://wardbryan3.github.io) — CS student and developer. Built as a desktop OS simulator with draggable windows, a dock, and an interactive terminal.

## Tech Stack

- **Astro v5** with React, MDX, and Sitemap integrations
- **React 19** for interactive UI (windows, terminal, 3D wallpapers)
- **Zustand** for state management (persisted to localStorage)
- **Three.js** via react-three-fiber for real-time wallpapers
- **GitHub Pages** for hosting (CI/CD via GitHub Actions)

## Development

```sh
npm install        # install dependencies
npm run dev        # start dev server (network exposed)
npm run build      # typecheck + build
npm run preview    # preview production build
```

## Structure

```
src/
  content/         # MDX blog posts and project pages
  components/      # React/Astro components
  layouts/         # Page layouts
  pages/           # Route pages
  stores/          # Zustand store (osStore)
  styles/          # CSS themes and global styles
  terminal/        # Terminal emulator + custom commands
```

## Deployment

Push to `main` — GitHub Actions builds and deploys to GitHub Pages. No branch previews.

## License

MIT
