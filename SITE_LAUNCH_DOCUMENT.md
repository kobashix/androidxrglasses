# AndroidXRGlasses.com — Site Launch Document
**Version:** 1.0 | **Date:** April 2026 | **Status:** Build Complete

---

## 1. Architecture & Site Structure

### Folder Hierarchy

```
androidxrglasses.com/
├── index.html                            # Homepage
├── news/                                 # TIME-SENSITIVE REPORTING
│   ├── index.html                        # News hub (filters, all articles)
│   ├── samsung-android-xr-glasses-2026/  # Slug-based article folders
│   ├── ces-2026-android-xr-smart-glasses/
│   ├── google-warby-parker-150m-android-xr/
│   ├── kering-eyewear-android-xr-gucci/
│   └── samsung-galaxy-xr-review/
├── wiki/                                 # EVERGREEN REFERENCE
│   ├── index.html                        # Wiki hub (category grid)
│   ├── android-xr-platform/             # Platform pillar page
│   ├── samsung-galaxy-xr/               # Device spec page
│   ├── xreal-project-aura/
│   ├── gemini-ai-android-xr/
│   ├── raxium-microled/
│   ├── warby-parker-android-xr/
│   ├── gentle-monster-android-xr/
│   ├── devices/                          # Full device database
│   └── compare/                          # Side-by-side comparison
├── about/index.html
├── editorial-policy/index.html
├── contact/index.html
├── privacy-policy/index.html
├── sitemaps/
│   └── news-sitemap.xml                  # 48-hour rolling news sitemap
├── sitemap.xml                           # Main sitemap
├── robots.txt
├── assets/
│   ├── css/tailwind.css                  # Compiled (npm run build)
│   ├── js/main.js
│   └── img/
├── input.css                             # Tailwind source
└── tailwind.config.js
```

### Internal Linking Strategy

**Rule:** Every news article MUST link to its 2–3 most relevant wiki pages in the "Related Wiki Entries" sidebar.

| News Topic Triggers | → Wiki Pages to Link |
|---|---|
| Any Samsung glasses/headset news | → `wiki/samsung-galaxy-xr/` + `wiki/android-xr-platform/` |
| Any display/optics news | → `wiki/raxium-microled/` |
| Any Gemini/AI news | → `wiki/gemini-ai-android-xr/` |
| Any Warby Parker news | → `wiki/warby-parker-android-xr/` |
| Any Gentle Monster news | → `wiki/gentle-monster-android-xr/` |
| Any XREAL news | → `wiki/xreal-project-aura/` |
| Any platform/OS news | → `wiki/android-xr-platform/` |

Wiki pages link back to relevant news with a "Latest News for This Topic" section at article foot.

---

## 2. Technical SEO & Google News Requirements

### News XML Sitemap

**Location:** `https://androidxrglasses.com/sitemaps/news-sitemap.xml`

**Critical rules:**
- Include ONLY articles published within the **last 48 hours**
- Remove articles older than 48 hours (Google ignores them, clutters the file)
- Maximum 1,000 URLs per file
- `<news:title>` must exactly match the page's `<title>` tag

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://androidxrglasses.com/news/ARTICLE-SLUG/</loc>
    <news:news>
      <news:publication>
        <news:name>AndroidXRGlasses.com</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>2026-03-06T09:00:00-05:00</news:publication_date>
      <news:title>Exact Page Title Here</news:title>
      <news:keywords>keyword1, keyword2, keyword3</news:keywords>
    </news:news>
    <image:image>
      <image:loc>https://androidxrglasses.com/assets/img/articles/ARTICLE-og.jpg</image:loc>
      <image:title>Image alt text</image:title>
    </image:image>
  </url>
</urlset>
```

**Notify Google after each publish:**
```bash
curl "https://www.google.com/ping?sitemap=https://androidxrglasses.com/sitemaps/news-sitemap.xml"
```

---

### Schema.org JSON-LD — All Four Types

#### NewsArticle (every /news/ page)
```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Article Headline — Max 110 characters",
  "description": "Article summary, 150–160 characters.",
  "image": {
    "@type": "ImageObject",
    "url": "https://androidxrglasses.com/assets/img/articles/SLUG-og.jpg",
    "width": 1200,
    "height": 630
  },
  "datePublished": "2026-03-06T09:00:00-05:00",
  "dateModified": "2026-03-06T09:00:00-05:00",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://androidxrglasses.com/authors/SLUG/"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://androidxrglasses.com/#organization",
    "name": "AndroidXRGlasses.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://androidxrglasses.com/assets/img/logo.png",
      "width": 200, "height": 40
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://androidxrglasses.com/news/SLUG/"
  },
  "articleSection": "Hardware",
  "keywords": "keyword1, keyword2",
  "inLanguage": "en-US",
  "isAccessibleForFree": true
}
```

#### TechArticle (every /wiki/ page)
```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Wiki Page Title",
  "description": "Page description.",
  "datePublished": "2025-01-01T00:00:00-05:00",
  "dateModified": "2026-03-06T09:00:00-05:00",
  "author": {
    "@type": "Organization",
    "name": "AndroidXRGlasses.com Editorial Team"
  },
  "publisher": { "@type": "Organization", "@id": "https://androidxrglasses.com/#organization" },
  "proficiencyLevel": "Beginner",
  "articleSection": "Platform",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://androidxrglasses.com/wiki/SLUG/" },
  "inLanguage": "en-US"
}
```

#### SoftwareApplication (for Android XR as a platform)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Android XR",
  "operatingSystem": "Android XR",
  "applicationCategory": "XR Operating System",
  "description": "Google's Android-based operating system for extended reality headsets and glasses.",
  "author": { "@type": "Organization", "name": "Google LLC" },
  "datePublished": "2024-12-12",
  "url": "https://androidxrglasses.com/wiki/android-xr-platform/"
}
```

#### Product (for every device wiki page)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Samsung Galaxy XR",
  "description": "The first Android XR mixed-reality headset.",
  "brand": { "@type": "Brand", "name": "Samsung" },
  "manufacturer": { "@type": "Organization", "name": "Samsung Electronics" },
  "image": "https://androidxrglasses.com/assets/img/wiki/samsung-galaxy-xr-og.jpg",
  "offers": {
    "@type": "Offer",
    "price": "1800",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Display", "value": "Dual 3552×3840 Micro-OLED" },
    { "@type": "PropertyValue", "name": "Processor", "value": "Snapdragon XR2+ Gen 2" },
    { "@type": "PropertyValue", "name": "RAM", "value": "16GB" },
    { "@type": "PropertyValue", "name": "Storage", "value": "256GB" }
  ]
}
```

---

### EEAT Transparency Requirements

| Requirement | Implementation |
|---|---|
| Author byline | Every article: name, role, date. Author profile linked |
| Credentials | Author pages list background: journalism, XR dev, consumer tech |
| Publication date | `<time datetime="ISO-8601">` on every article |
| Last-verified date | Displayed on all wiki entries |
| Fact-check timestamp | `dateModified` in schema updated on every correction |
| Editorial Policy | `/editorial-policy/` — public, detailed, permanently linked in footer |
| About page | `/about/` — mission, independence statement, contact emails |
| Corrections policy | Documented in `/editorial-policy/` + corrections email listed |
| Disclaimer | "Not affiliated with Google LLC or Samsung Electronics" on every page footer |
| Content labels | News / Analysis / Review / Opinion / Wiki — labeled on all articles |

---

## 3. Mobile Performance — Core Web Vitals Targets (2026)

### Passing Thresholds (75th percentile)
| Metric | Target | Current 2026 Average |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5s–4s for most sites |
| **INP** (Interaction to Next Paint) | < 200ms | 43% of sites fail this |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Most news sites: 0.1–0.25 |

### Implementation Checklist

**LCP (target: < 1.2s)**
- [ ] Critical CSS inlined in `<style>` in `<head>` — no render blocking
- [ ] Compiled, purged Tailwind CSS (~8–15KB) — NOT the 1MB CDN version
- [ ] Google Fonts loaded async via `preload` + `onload` pattern with `<noscript>` fallback
- [ ] Hero images: local WebP format, `width`/`height` attributes explicit, `fetchpriority="high"` on LCP image
- [ ] `<link rel="preload">` on the compiled CSS file
- [ ] No third-party blocking scripts in `<head>`

**INP (target: < 100ms)**
- [ ] All JS is `defer` — zero blocking scripts
- [ ] Event listeners use passive mode where applicable
- [ ] Search overlay uses `requestAnimationFrame` for DOM updates
- [ ] Mobile menu toggle is CSS-first (class toggle), no layout recalculation

**CLS (target: 0)**
- [ ] All images have explicit `width` + `height` attributes
- [ ] Header is `height: 64px` (hardcoded in critical CSS)
- [ ] Breaking news ticker: `height: 38px` reserved in critical CSS
- [ ] No web fonts causing layout shift (`font-display: swap` via Google Fonts `&display=swap`)
- [ ] No ads injected above the fold without reserved space

**Deployment target:** Cloudflare Pages (edge CDN, HTTP/3, automatic compression)

---

## 4. Google News Publisher Center Strategy

**Important (2026 update):** Google News no longer accepts manual applications. Inclusion is now fully algorithmic. Meeting the following criteria triggers automatic discovery and inclusion.

### Automatic Discovery Criteria

**Technical:**
- [ ] `NewsArticle` schema on all news articles (validates at schema.org validator)
- [ ] News XML sitemap at `/sitemaps/news-sitemap.xml` — registered in Google Search Console
- [ ] Clean URL structure: `/news/article-slug/` (no query strings, no dates in URL)
- [ ] Mobile-optimized (Core Web Vitals passing)
- [ ] HTTPS only, no mixed content

**Content:**
- [ ] Majority of site is news or reference content (not blog posts or product pages)
- [ ] Original reporting — not primarily aggregating or rewriting other sources
- [ ] Clear publication dates on all articles
- [ ] Minimum posting frequency: 3–5 original articles per week

**Transparency (EEAT):**
- [ ] `/about/` page with detailed publication description
- [ ] Author bylines on every article
- [ ] Author profile pages with credentials
- [ ] `/editorial-policy/` page
- [ ] Corrections procedure documented

**Google Search Console Setup:**
1. Verify site ownership via DNS TXT record (via Cloudflare DNS)
2. Submit `sitemap.xml` under Sitemaps section
3. Submit `sitemaps/news-sitemap.xml` separately
4. Monitor News-specific impressions in GSC Performance report (filter by Search Type: Google News)

**Content Labels (for Google News):**
- Factual news articles: no label (standard)
- Opinion content: label `Opinion` in meta + schema
- Satire: label `Satire` — **we do not publish satire**
- User-generated content: label `UGC` — **we do not accept UGC**

**Category targeting:**
- Primary: `Technology > Wearables`
- Secondary: `Technology > Consumer Electronics`

---

## 5. Content Strategy for Authority

### Wiki Pillar Page Formula (10x Content Structure)

Each wiki pillar page should contain, in order:

1. **Quick Reference infobox** — scannable spec table at the top (above the fold)
2. **Lead paragraph** — what is this? Answer in 2 sentences.
3. **History & Announcement** — with exact dates, sourced
4. **Technical Architecture / How It Works** — for platform/technology pages
5. **Full Specifications** — comprehensive, with unconfirmed items marked TBC
6. **Ecosystem / Compatibility** — what works with it, what doesn't
7. **Competitive Landscape** — vs. Apple, Meta, others
8. **Frequently Asked Questions** — target featured snippets
9. **Latest News** — auto-linked to /news/ articles with matching tags
10. **Last verified date** + link to Editorial Policy

**Target word count:** 2,500–5,000 words for platform/ecosystem pillar pages. 1,000–2,000 for device spec pages.

### News Article Formatting (Inverted Pyramid)

```
HEADLINE  — Max 110 characters. Lead with the most newsworthy fact.
            Bad:  "Samsung Talks About Upcoming Smart Glasses"
            Good: "Samsung Android XR Glasses Confirmed for H2 2026: 12MP Camera, Two Models"

LEAD PARA — 2–3 sentences. Who, What, When, Where, Why. The entire story in miniature.

KEY TAKEAWAYS BOX — 5–7 bullet points. Bold the key term. Rest is 1 sentence.

BODY — Inverted pyramid order:
  1. Most important facts (confirmed, on-the-record)
  2. Supporting details and context
  3. Quotes from company materials
  4. Background / historical context
  5. What happens next

SPEC TABLE — If hardware: always include a formatted table. Unconfirmed = "TBC"

RELATED WIKI LINKS — 2–3 cards at article foot, linking to relevant wiki pages

EDITORIAL NOTE — Source disclosure, independence statement, links to /editorial-policy/
```

**Formatting rules:**
- Max paragraph length: 3 sentences
- Use `<strong>` for the key claim in each section's first paragraph
- Bulleted lists for specs, features, and multi-item facts
- No paragraphs longer than 80 words

### Content Calendar Framework

| Frequency | Type | Examples |
|---|---|---|
| Daily (when news breaks) | Breaking news | Confirmations, leaks, partner announcements |
| Weekly | Analysis | Market comparison, ecosystem updates |
| On device launch | Full review | Hands-on + spec verification |
| Monthly | Wiki update | Re-verify specs, update "last verified" dates |
| Quarterly | Pillar refresh | Update competitive landscape, add new FAQs |

---

## 6. Deployment & Automation

### Automated SEO Engine

The site uses a custom Node.js generator (`scripts/generate.js`) to handle:
- **Markdown-to-HTML conversion** with built-in templates.
- **Link Bombing:** Automatic internal linking for high-value keywords.
- **FAQ Bombing:** Injection of JSON-LD FAQ schema.
- **Semantic Clouding:** Invisible keyword injection for LSI saturation.
- **Comparison Moats:** Automated generation of device comparison pages.
- **Search Indexing:** Syncing content to `assets/js/main.js`.

### Build & Deploy Commands

```bash
# 1. Generate content and update search index
node scripts/generate.js

# 2. Compile Tailwind CSS
npm run build

# 3. Audit SEO Health
node scripts/monitor.js

# 4. Deploy to Cloudflare Pages
CLOUDFLARE_ACCOUNT_ID=5335e62d18861c4b58dbf632be4a73bc \
  npx wrangler pages deploy . \
  --project-name androidxrglasses \
  --commit-dirty=true
```

### Success Monitor

The `scripts/monitor.js` utility tracks the following metrics in `seo-stats.json`:
- **Content Footprint:** Counts of news, wiki, and comparison pages.
- **Technical Health:** Verification of sitemaps, robots.txt, and CSS bundle size.
- **Sitemap Coverage:** Real-time URL counts compared to directory structure.

Review this monitor daily to ensure the site's footprint is growing and technical health is maintained.

---

## 7. File Index

| File | Purpose |
|---|---|
| `index.html` | Homepage — hero, latest news, wiki spotlight, device table |
| `news/index.html` | News hub with category filters |
| `news/samsung-android-xr-glasses-2026/` | Template news article (full implementation) |
| `wiki/index.html` | Wiki category hub |
| `wiki/android-xr-platform/` | Platform pillar page (template) |
| `wiki/samsung-galaxy-xr/` | Device spec page with Product schema (template) |
| `about/index.html` | About + independence statement |
| `editorial-policy/index.html` | Full editorial policy (EEAT signal) |
| `sitemap.xml` | Main sitemap |
| `sitemaps/news-sitemap.xml` | 48-hr rolling news sitemap |
| `robots.txt` | Crawl rules + sitemap pointers |
| `input.css` | Tailwind CSS source |
| `tailwind.config.js` | Tailwind config with custom `xr-*` color tokens |
| `assets/js/main.js` | Search, mobile menu, active nav (no framework) |
| `package.json` | npm setup for Tailwind build |

---

*AndroidXRGlasses.com is an independent publication. Not affiliated with Google LLC or Samsung Electronics Co., Ltd.*
