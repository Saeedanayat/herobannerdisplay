# H A T E D — Forever (Guild Homepage)

Static site. No build step. Open `index.html` or deploy the folder to any static host (Netlify, Vercel, GitHub Pages).
Test locally with `python3 -m http.server` so video loads correctly.

## Structure
- `index.html` — markup
- `css/main.css` — design tokens (CSS variables), layout, sections
- `css/hero.css` — hero, title treatment, lightning, switcher
- `js/main.js` — header scroll state, mobile menu
- `js/hero-switcher.js` — hero crossfade, tabs/arrows/swipe, lightning, video handling
- `assets/` — your media (see below)

## Replacing assets
Drop files into `assets/hero/`, keeping these names:

| Hero | Video | Fallback image |
|---|---|---|
| 01 Thunderfury | `hero-01.mp4` | `hero-01.jpg` |
| 02 Horde March | `hero-02.mp4` | `hero-02.jpg` |
| 03 Dark Twilight | `hero-03.mp4` | `hero-03.jpg` |

Logo: `assets/logo/hated-logo.png` (the header currently uses a text wordmark; swap in an `<img>` inside `.brand` when ready).

Until files exist, each hero shows a CSS gradient twilight scene, so the site works immediately. If a video is missing or fails, it is removed and the image/gradient is used. Recommended: 1920×1080, MP4 (H.264) under ~8 MB, 8–12 s seamless loop, and an optional `.webm` `<source>` for smaller size. Images should be dark with the lower third quiet, since the title sits centered.

## Editing hero copy / adding a hero
Each hero is an `<article class="slide slide--N">` in `index.html` with its own title, quote and CTAs. Add a new one, copy the `.slide--N` rules in `hero.css`, and the switcher picks it up automatically. `data-lightning` controls arc intensity (`1` strong, `0` off).

## Notes
- Respects `prefers-reduced-motion` (no lightning, no autoplay video).
- Videos are muted, looped, `playsinline`; only the active hero plays.
- Use only assets you have rights to; WoW is a Blizzard trademark.
