# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Run the SEO Engine (Generates HTML from Markdown, updates sitemaps and search index)
node scripts/generate.js

# Compile Tailwind CSS (required after any HTML class changes)
npm run build

# Run SEO Success Audit
node scripts/monitor.js

# Watch mode during development
npm run watch

# Deploy to Cloudflare Pages
CLOUDFLARE_ACCOUNT_ID=5335e62d18861c4b58dbf632be4a73bc npx wrangler pages deploy . --project-name androidxrglasses --commit-dirty=true
```

Always run `node scripts/generate.js` and `npm run build` before deploying.

## Architecture

Static HTML site generated via an **Aggressive SEO Engine** (`scripts/generate.js`). 
- **Source:** Markdown files in `content/news/` and `content/wiki/`.
- **Output:** Flat `index.html` files in slug-based folders (e.g., `/news/slug/index.html`).
- **Templates:** The generator uses hardcoded template strings in `scripts/generate.js` to ensure consistency.

**URL structure:**
- `/news/slug/index.html` — individual news articles
- `/wiki/slug/index.html` — encyclopedia entries
- `/wiki/compare/slug/index.html` — automated "vs" comparison pages
- `/news/index.html`, `/wiki/index.html` — section indexes (partially manual, partially automated)

**CSS:** Tailwind v3 compiled from `input.css` → `assets/css/tailwind.css`. Custom design tokens are all under the `xr-*` namespace in `tailwind.config.js`.

**JS:** Single file `assets/js/main.js`. The `SEARCH_INDEX` array is **automatically updated** by `scripts/generate.js`. Do not edit it manually.

## Adding New Content

**New news article:** Create a new `.md` file in `content/news/`.
1. Set the frontmatter: `title`, `date`, `description`, `tags`, `image`, `searchTags`.
2. Write the body in Markdown.
3. Run `node scripts/generate.js` to generate the page and update the search index.

**New wiki entry:** Create a new `.md` file in `content/wiki/`.
1. Set `wikiCategory: device` for hardware (triggers automated comparisons).
2. Run `node scripts/generate.js`.


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
