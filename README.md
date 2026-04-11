# dallas.rip Website

Personal portfolio website with a retro-futuristic "monitor bezel" design, interactive Three.js backgrounds, and a Decap CMS for content management.

## Architecture

Static HTML/CSS/JS site — no frontend framework. Content is managed via Markdown files and a Node.js build script that generates JSON. Deployed on Netlify.

```
dallas.rip website/
├── index.html              # Landing page (cycling text, cityscape background)
├── about.html              # About page
├── contact.html            # Contact form
├── photography.html        # Photography portfolio (dynamic from CMS)
├── videography.html        # Videography portfolio (dynamic from CMS)
├── websites.html           # Web design portfolio
├── advertising.html        # Advertising services
├── styles.html             # Style guide (no background effect)
│
├── background.js           # Three.js shader cityscape — used on most pages
├── canvas.js               # Three.js 3D ripple grid — used on photo/video pages
├── header.js               # Injects hamburger nav overlay into #global-header
├── footer.js               # Injects footer into #global-footer
├── loader.js               # Full-screen loading screen (hides via window.pageIsReady())
├── settings-manager.js     # Loads _data/settings.json and updates page meta
│
├── global.css              # All styles (retro CRT monitor theme)
├── build.js                # Build script: copies files, bundles libs, generates JSON
├── netlify.toml            # Netlify: build command + publish dir
│
├── _photography/           # Markdown files for photography CMS content
├── _videography/           # Markdown files for videography CMS content
├── _data/settings.json     # Global site settings (title, description, etc.)
└── admin/config.yml        # Decap CMS configuration
```

## Three.js Backgrounds

Two separate effects — both loaded as **ES modules** (`type="module"`):

| Script | Pages | Effect |
|--------|-------|--------|
| `background.js` | index, about, contact, websites, advertising | Shader-based pixelated cityscape with mouse glow and click flash |
| `canvas.js` | photography, videography | 3D 40×40 instanced box grid with mouse-driven ripple waves |

Both import Three.js from `/libs/three.module.js` (copied from node_modules at build time).

`background.js` additionally imports GSAP for smooth mouse tracking via `/libs/gsap.js`.

## Build Process

```bash
npm install
npm run build   # outputs to dist/
```

`build.js` does four things:
1. Copies all HTML, CSS, JS source files and `_data/`, `admin/` to `dist/`
2. Copies library files from `node_modules/` to `dist/libs/`:
   - `three.module.js` — Three.js ES module build
   - `gsap.js` — GSAP entry point (ES module, imports from `./gsap-core.js` and `./CSSPlugin.js`)
   - `gsap-core.js` — GSAP core (required by gsap.js)
   - `CSSPlugin.js` — GSAP CSS plugin (required by gsap.js)
3. Parses Markdown frontmatter in `_photography/` and `_videography/`, outputs `_photography.json` and `_videography.json`. Image paths are rewritten from `.jpg`/`.png` → `.avif` in the JSON output.
4. Converts all images in `assets/uploads/` to AVIF at quality 75 using `sharp`, saving them as `.avif` in `dist/assets/uploads/`. Source JPGs are never modified.

> **Important:** `gsap.js` has relative imports for `gsap-core.js` and `CSSPlugin.js`. All three must be present in `dist/libs/` or GSAP will fail to load.

> **Image workflow:** Always upload full-resolution JPGs via the CMS — the build handles AVIF conversion automatically. Never commit AVIF files to the repo; they belong in `dist/` only.

Netlify runs `npm run build` on every push and publishes `dist/`.

## Content Management

Photography and videography portfolios are managed via [Decap CMS](https://decapcms.org/) at `/admin`. Content is stored as Markdown files with YAML frontmatter. The build script reads these and generates JSON consumed by the page scripts.

Each photography entry (`_photography/*.md`) supports:
- `title`, `image`, `description`, `categories` (cities, nature, people, commercial)

Each videography entry (`_videography/*.md`) supports:
- `title`, `video_url`, `thumbnail`, `description`

## Loader

`loader.js` shows a full-screen loading screen. Pages signal readiness by calling `window.pageIsReady()`. A 3-second failsafe hides the loader if `pageIsReady` is never called.

Pages with dynamic content (photography, videography) call `pageIsReady()` after the JSON fetch completes. Static pages call it from a `DOMContentLoaded` listener.

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `three` | ^0.183.2 | 3D/WebGL backgrounds |
| `gsap` | ^3.14.2 | Smooth mouse animation in background.js |
| `gray-matter` | ^4.0.3 | Markdown frontmatter parsing in build.js |
| `fs-extra` | ^11.3.4 | File copy utilities in build.js |
| `http-server` | ^14.1.1 | Local development (`npm start`) |

## Local Development

```bash
npm install
npm run build
npm start       # serves dist/ at http://localhost:8080
```

## Known Constraints

- **No tree-shaking** — Three.js (~624 KB) and GSAP are copied in full. The shader effect on most pages only needs a fraction of Three.js.
- **No CSS/JS minification** — files are copied as-is to dist.
