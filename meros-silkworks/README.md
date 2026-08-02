# Meros Silkworks

Catalog-first site for [merossilkworks.com](https://merossilkworks.com) — handmade Uzbek atlas/ikat accessories. Discovery, story, and trust live here; **every purchase deep-links to Etsy** (permanent side-by-side, decision #3 in the architecture doc).

Source of truth: `meros-silkworks-architecture.md` (kept outside this repo).

## Stack

- **Astro 5**, static output, near-zero JS
- Content collections with schema validation (`src/content.config.ts`, per §6)
- Self-hosted fonts via Fontsource (Fraunces Variable + Work Sans Variable)
- Deploy: GitHub Actions → GitHub Pages, custom domain via `public/CNAME`

## Commands

| Command           | Action                       |
| ----------------- | ---------------------------- |
| `npm install`     | Install dependencies         |
| `npm run dev`     | Dev server at localhost:4321 |
| `npm run build`   | Production build to `dist/`  |
| `npm run preview` | Preview the build locally    |

## Structure

```
src/
├── components/     # by domain: layout/ catalog/ content/ forms/ system/
├── layouts/
├── pages/
├── content/
│   ├── products/   # one .md per product — Decap CMS writes here (Phase 2)
│   ├── craft/
│   └── reviews.json
├── content.config.ts
├── assets/products/  # product photography (goes through the image pipeline)
└── styles/           # tokens.css + global.css + fonts.css
```

## Conventions

- **Product slug = filename.** `doppi-hair-ties.md` → `/shop/doppi-hair-ties`.
- **Long description = markdown body** of the product file.
- `etsyUrl` is required on every product, indefinitely.
- `fabricOrigin` stays **unset** until sourcing is verified with Saida — no region claims in copy (decision #2).
- All interface color comes from `src/styles/tokens.css`; components never hardcode hex values. `--accent` is reassigned per page from the featured piece's dye — never treat it as a brand constant.

## Deploy

Push to `main` → GitHub Actions builds and publishes to Pages. One-time setup in the repo settings: **Settings → Pages → Source: GitHub Actions**, then point the domain's DNS (A/ALIAS + CNAME records) at GitHub Pages.
