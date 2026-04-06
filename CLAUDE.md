# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Compile Tailwind CSS (required after any HTML class changes)
npm run build

# Watch mode during development
npm run watch

# Deploy to Cloudflare Pages
CLOUDFLARE_ACCOUNT_ID=5335e62d18861c4b58dbf632be4a73bc npx wrangler pages deploy . --project-name androidxrglasses --commit-dirty=true
```

Always run `npm run build` before deploying — the compiled `assets/css/tailwind.css` is tracked in git and must be up to date.

## Architecture

Static HTML site with no build framework — every page is a plain `index.html` at a folder-based URL path. There is no templating engine; headers, footers, and nav are copy-pasted across files.

**URL structure:**
- `/news/slug/index.html` — individual news articles
- `/wiki/slug/index.html` — encyclopedia entries
- `/news/index.html`, `/wiki/index.html` — section indexes

**CSS:** Tailwind v3 compiled from `input.css` → `assets/css/tailwind.css`. Custom design tokens are all under the `xr-*` namespace in `tailwind.config.js`. The component layer in `input.css` defines all reusable classes: `.news-card`, `.wiki-card`, `.tag-*`, `.article-body`, `.spec-row`, `.key-takeaway`, `.breadcrumb`, `.toc`, etc.

**JS:** Single file `assets/js/main.js` — no framework. Handles client-side search (static `SEARCH_INDEX` array), mobile menu toggle, and active nav marking. The search index is hardcoded; add new pages to `SEARCH_INDEX` when creating new content.

**Inline `<style>` block in every page head:** Each page has a minimal render-blocking inline style for `body` background/color and `.skip-link` — this is intentional for CLS/FCP. The values must stay `background:#fff;color:#0f172a` (do not revert to the old dark theme `#080c18`).

## Adding New Content

**New news article:** Copy an existing article in `news/`, update the slug folder name, and update:
1. The `<title>`, `<meta description>`, `<link rel="canonical">` in `<head>`
2. The JSON-LD `NewsArticle` schema block (datePublished, headline, description, author)
3. All article body content
4. Add the article to `SEARCH_INDEX` in `assets/js/main.js`
5. Add a card to `news/index.html`
6. Update `sitemap.xml` and `sitemaps/news-sitemap.xml`

**New wiki entry:** Same pattern using `/wiki/` as the base path. Wiki pages use `TechArticle` or `Product` schema instead of `NewsArticle`.

## Design System

- **Header:** Dark `#0f172a` (`bg-xr-header`) — sticky, always dark
- **Body:** White `#ffffff` — never use a dark background on body
- **Accent:** `#2563eb` (`xr-blue`) — single blue accent, no cyan/neon
- **Fonts:** Inter (sans) loaded async via Google Fonts preload pattern; Georgia (serif) used for article `h2`/`h3` headings via `.article-body`
- **Tag variants:** `.tag-news` (red), `.tag-breaking` (red solid), `.tag-wiki` (blue), `.tag-hardware` (green), `.tag-analysis` (purple), `.tag-review` (orange), `.tag-available` (green solid)

## Images

Images live in `assets/img/`. Resize large originals to web-optimized versions before committing — use PIL or similar. Available resized images:
- `android-xr-io25-web.jpg` (110KB) — Google I/O XR demo stage
- `android-xr-show-header-web.jpg` (57KB) — Android XR announcement header
- `samsung-galaxy-xr-front.jpg` (168KB) — Samsung Galaxy XR front view
- `samsung-galaxy-xr-worn-web.jpg` (112KB) — Samsung Galaxy XR being worn
- `samsung-galaxy-xr-pedestal-web.jpg` (31KB) — Samsung Galaxy XR on pedestal

Always set explicit `width`, `height`, and `aspect-ratio` on `<img>` tags to prevent CLS.

## Schema.org / SEO

Each page type has a specific JSON-LD schema:
- News articles: `NewsArticle` with `datePublished`, `dateModified`, `author`, `publisher`
- Wiki device pages: `Product` with `additionalProperty` array for specs
- Wiki platform pages: `TechArticle`
- Index/listing pages: `CollectionPage`
- All pages include `BreadcrumbList`

The `WebSite` + `Organization` schemas with `@id` anchors live on the homepage only and are referenced via `@id` on other pages.

## Deployment

GitHub repo: `kobashix/androidxrglasses` (push to `master`)
Cloudflare Pages project: `androidxrglasses` → `androidxrglasses.com`
