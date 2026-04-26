#!/usr/bin/env node
// scripts/generate.js — AndroidXRGlasses.com AGGRESSIVE SEO ENGINE
'use strict';

const fs   = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT     = path.resolve(__dirname, '..');
const SITE_URL = 'https://androidxrglasses.com';

// ── SEO ENGINE CONFIGURATION ────────────────────────────────────────────────

const SEO_ENTITIES = {
  'Android XR': {
    wiki: 'https://en.wikipedia.org/wiki/Android_XR',
    official: 'https://android.com/xr',
    sameAs: ['https://www.google.com/search?q=Android+XR', 'https://en.wikipedia.org/wiki/Android_XR']
  },
  'Samsung': {
    wiki: 'https://en.wikipedia.org/wiki/Samsung_Electronics',
    official: 'https://www.samsung.com/us/computing/xr/',
    sameAs: ['https://www.samsung.com']
  },
  'Qualcomm': {
    wiki: 'https://en.wikipedia.org/wiki/Qualcomm',
    official: 'https://www.qualcomm.com/products/application/xr',
    sameAs: ['https://www.qualcomm.com']
  },
  'Gemini AI': {
    wiki: 'https://en.wikipedia.org/wiki/Gemini_(chatbot)',
    official: 'https://gemini.google.com',
    sameAs: ['https://deepmind.google/technologies/gemini/']
  }
};

const LINK_BOMB_MAP = {
  'Android XR': '/wiki/android-xr-platform/',
  'Samsung Galaxy XR': '/wiki/samsung-galaxy-xr/',
  'Raxium': '/wiki/raxium-microled/',
  'MicroLED': '/wiki/raxium-microled/',
  'Snapdragon XR2+ Gen 3': '/wiki/snapdragon-xr2-plus-gen-3/',
  'Galaxy Glasses': '/news/samsung-galaxy-glasses-leak-specs-2026/',
  'Gemini AI': '/wiki/gemini-ai-android-xr/'
};

const COMPETITORS = [
  { name: 'Apple Vision Pro', url: 'https://www.apple.com/apple-vision-pro/' },
  { name: 'Meta Ray-Ban', url: 'https://www.meta.com/smart-glasses/ray-ban-meta/' },
  { name: 'Meta Quest 3S', url: 'https://www.meta.com/quest/quest-3s/' },
  { name: 'XREAL Air 2', url: 'https://www.xreal.com/air2' }
];

// ── SEO ENGINE LOGIC ────────────────────────────────────────────────────────

/**
 * 4. Aggressive Internal "Anchor Text" Link Bombing
 */
function linkBomb(html) {
  let content = html;
  // Sort keys by length descending to avoid partial matches (e.g. "Android XR" vs "Android")
  const keys = Object.keys(LINK_BOMB_MAP).sort((a, b) => b.length - a.length);
  
  keys.forEach(key => {
    // Only link first 2 occurrences to avoid over-optimization penalties
    let count = 0;
    const re = new RegExp(`\\b(${key})\\b(?![^<]*>)`, 'gi'); // Don't match inside tags
    content = content.replace(re, (match) => {
      count++;
      if (count <= 2) {
        return `<a href="${LINK_BOMB_MAP[key]}" class="text-xr-blue hover:underline font-medium">${match}</a>`;
      }
      return match;
    });
  });
  return content;
}

/**
 * 1. The "Freshness Loop" Nudge
 */
function nudgeTimestamp(dateIso) {
  const d = new Date(dateIso);
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  
  // If it's within the last 45 days, nudge it to today's date minus 1-2 days
  // to keep it "Fresh" in Google News without looking like a bot error.
  if (diffDays < 45 && diffDays > 2) {
    const nudged = new Date();
    nudged.setDate(nudged.getDate() - 1);
    return nudged.toISOString().split('T')[0];
  }
  return dateIso;
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function esc(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const TAG_MAP = {
  breaking: 'tag-breaking', leak: 'tag-breaking',
  hardware: 'tag-hardware', fashion: 'tag-hardware', platform: 'tag-hardware',
  analysis: 'tag-analysis',
  review: 'tag-review',
  news: 'tag-news', partnership: 'tag-news',
  wiki: 'tag-wiki', 'partner wiki': 'tag-wiki', 'hardware wiki': 'tag-wiki',
  'platform wiki': 'tag-wiki', 'platform guide': 'tag-wiki',
  partner: 'tag-wiki', ai: 'tag-wiki', display: 'tag-wiki',
  'ces 2026': 'tag-wiki', samsung: 'tag-wiki', 'all devices': 'tag-wiki',
  'available now': 'tag-available',
};
function tagCls(tag) { return TAG_MAP[tag.toLowerCase()] || 'tag-wiki'; }

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function extractToc(html) {
  const re = /<h2[^>]+id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/gi;
  const toc = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    toc.push({ id: m[1], text: m[2].replace(/<[^>]+>/g, '') });
  }
  return toc;
}

function slugFromFile(file) {
  return path.basename(file, '.md');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// ── Shared HTML Partials ──────────────────────────────────────────────────────

function pageHead({ title, description, canonical, ogImage, datePublished, dateModified, section, schemaJson }) {
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${SITE_URL}${canonical}">
  ${ogImage ? `<meta property="og:type"        content="article">
  <meta property="og:title"       content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url"         content="${SITE_URL}${canonical}">
  <meta property="og:image"       content="${SITE_URL}/assets/img/${esc(ogImage)}">
  <meta property="og:image:width"  content="1200">
  <meta property="og:image:height" content="630">
  ${datePublished ? `<meta property="article:published_time" content="${datePublished}">` : ''}
  ${dateModified  ? `<meta property="article:modified_time"  content="${dateModified}">` : ''}
  ${section       ? `<meta property="article:section"        content="${esc(section)}">` : ''}
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:site"        content="@AndroidXRGlass">
  <meta name="twitter:title"       content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">` : ''}
  <link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="/assets/css/tailwind.css">
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"></noscript>
  <style>*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{background:#fff;color:#0f172a;font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}.skip-link{position:absolute;top:-100px;left:1rem;background:#2563eb;color:#fff;padding:.5rem 1rem;border-radius:0 0 .5rem .5rem;font-weight:700;font-size:.875rem;transition:top .2s;z-index:9999}.skip-link:focus{top:0}</style>
  ${schemaJson ? `<script type="application/ld+json">\n  ${schemaJson}\n  </script>` : ''}
</head>`;
}

function siteHeader(active) {
  function nl(href, label, key) {
    const isActive = active === key;
    return `<a href="${href}" class="nav-link px-3 py-2 rounded-lg hover:bg-slate-800${isActive ? ' text-white' : ''}"${isActive ? ' aria-current="page"' : ''}>${label}</a>`;
  }
  return `
<a href="#main-content" class="skip-link">Skip to main content</a>
<header id="site-header" class="sticky top-0 z-40 bg-xr-header border-b border-xr-header-2" role="banner">
  <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
    <a href="/" class="flex items-center gap-2.5 shrink-0" aria-label="AndroidXRGlasses.com — Home">
      <img src="/assets/img/favicon.svg" width="26" height="26" alt="" aria-hidden="true">
      <span class="text-white font-bold text-sm hidden sm:block">AndroidXR<span class="text-blue-400">Glasses</span><span class="text-slate-500">.com</span></span>
    </a>
    <nav class="hidden md:flex items-center gap-0.5" aria-label="Primary navigation">
      ${nl('/news/', 'News', 'news')}
      ${nl('/wiki/', 'Wiki', 'wiki')}
      <a href="/wiki/devices/" class="nav-link px-3 py-2 rounded-lg hover:bg-slate-800">Devices</a>
      <a href="/wiki/compare/" class="nav-link px-3 py-2 rounded-lg hover:bg-slate-800">Compare</a>
      <a href="/about/"        class="nav-link px-3 py-2 rounded-lg hover:bg-slate-800">About</a>
    </nav>
    <div class="flex items-center gap-2">
      <button id="search-trigger" class="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm transition-colors" aria-label="Search" aria-expanded="false">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span class="hidden sm:inline">Search</span>
      </button>
      <button id="mobile-menu-btn" class="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>
  </div>
  <nav id="mobile-menu" class="md:hidden hidden border-t border-slate-800" aria-label="Mobile navigation">
    <div class="max-w-8xl mx-auto px-4 py-4 flex flex-col gap-1">
      <a href="/news/"         class="nav-link px-3 py-2.5 rounded-lg hover:bg-slate-800">News</a>
      <a href="/wiki/"         class="nav-link px-3 py-2.5 rounded-lg hover:bg-slate-800">Wiki</a>
      <a href="/wiki/devices/" class="nav-link px-3 py-2.5 rounded-lg hover:bg-slate-800">Devices</a>
      <a href="/about/"        class="nav-link px-3 py-2.5 rounded-lg hover:bg-slate-800">About</a>
    </div>
  </nav>
</header>`;
}

function searchOverlay() {
  return `
<div id="search-overlay" class="fixed inset-0 z-50 bg-black/50 hidden" style="backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)" role="dialog" aria-modal="true" aria-label="Site search">
  <div class="max-w-2xl mx-auto mt-20 px-4">
    <div class="bg-white border border-xr-border rounded-xl overflow-hidden shadow-2xl">
      <div class="flex items-center gap-3 px-4 py-3.5 border-b border-xr-border">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b9ab5" stroke-width="2" class="shrink-0" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input id="search-input" type="search" placeholder="Search news, devices, wiki&hellip;" class="flex-1 bg-transparent text-xr-text-1 placeholder-xr-muted outline-none text-sm">
        <button id="search-close" class="text-slate-400 hover:text-white text-xs font-mono border border-xr-border rounded px-1.5 py-0.5" aria-label="Close search">ESC</button>
      </div>
      <div id="search-results" class="p-4 max-h-96 overflow-y-auto">
        <p class="text-xr-text-3 text-sm text-center py-6">Start typing to search&hellip;</p>
      </div>
    </div>
  </div>
</div>`;
}

function siteFooter(type) {
  const links = type === 'wiki'
    ? `<a href="/wiki/devices/" class="text-xr-muted hover:text-xr-text-3 transition-colors">Device Database</a>
      <a href="/editorial-policy/" class="text-xr-muted hover:text-xr-text-3 transition-colors">Editorial Policy</a>`
    : `<a href="/" class="text-xr-muted hover:text-xr-text-3 transition-colors">Home</a>
      <a href="/news/" class="text-xr-muted hover:text-xr-text-3 transition-colors">News</a>
      <a href="/wiki/" class="text-xr-muted hover:text-xr-text-3 transition-colors">Wiki</a>
      <a href="/editorial-policy/" class="text-xr-muted hover:text-xr-text-3 transition-colors">Editorial Policy</a>`;
  return `
<footer class="border-t border-xr-border bg-xr-header mt-12" role="contentinfo">
  <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
    <p class="text-xr-muted">&copy; 2026 AndroidXRGlasses.com. Not affiliated with Google LLC or Samsung Electronics.</p>
    <div class="flex items-center gap-5">
      ${links}
    </div>
  </div>
</footer>
<script defer src="/assets/js/main.js"></script>
</body>
</html>`;
}

// ── Schema generators ─────────────────────────────────────────────────────────

function breadcrumbSchema(crumbs) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.item ? { item: SITE_URL + c.item } : {}),
    })),
  };
}

/**
 * 3. Entity Relationship Hijacking (Schema Abuse)
 */
function buildSchema(meta, slug, type) {
  const url = `${SITE_URL}/${type}/${slug}/`;
  const imageUrl = meta.image ? `${SITE_URL}/assets/img/${meta.image}` : undefined;
  const publisher = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'AndroidXRGlasses.com',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/img/favicon.svg`, width: 100, height: 100 },
  };
  const author = { '@type': 'Person', name: 'AndroidXRGlasses Staff', url: `${SITE_URL}/about/` };

  // Collect Entity Connections
  const connections = [];
  Object.keys(SEO_ENTITIES).forEach(e => {
    if (meta.title.includes(e) || (meta.searchTags || []).includes(e)) {
      connections.push(...SEO_ENTITIES[e].sameAs);
    }
  });

  if (type === 'news') {
    const dateIso = nudgeTimestamp(meta.date ? String(meta.date) : '');
    const dateTime = dateIso.includes('T') ? dateIso : dateIso + 'T09:00:00-05:00';
    const article = {
      '@type': meta.schemaType === 'Review' ? 'Review' : 'NewsArticle',
      '@id': url + '#article',
      headline: meta.title,
      description: meta.description,
      ...(imageUrl ? { image: { '@type': 'ImageObject', url: imageUrl, width: 1200, height: 630 } } : {}),
      datePublished: dateTime,
      dateModified: dateTime,
      author, publisher,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      articleSection: meta.section || 'News',
      keywords: (meta.searchTags || []).join(', '),
      inLanguage: 'en-US',
      isAccessibleForFree: true,
      sameAs: connections.length ? connections : undefined
    };
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        article,
        breadcrumbSchema([
          { name: 'Home', item: '/' },
          { name: 'News', item: '/news/' },
          { name: meta.title },
        ]),
      ],
    }, null, 2);
  }

  // wiki
  const wikiArticle = meta.schemaType === 'Product' ? {
    '@type': 'Product',
    '@id': url + '#product',
    name: meta.title,
    description: meta.description,
    ...(imageUrl ? { image: imageUrl } : {}),
    brand: { '@type': 'Brand', name: meta.brand || 'Android XR' },
    publisher,
    sameAs: connections.length ? connections : undefined
  } : {
    '@type': 'TechArticle',
    '@id': url + '#article',
    headline: meta.title,
    description: meta.description,
    ...(imageUrl ? { image: imageUrl } : {}),
    author, publisher,
    inLanguage: 'en-US',
    sameAs: connections.length ? connections : undefined
  };

  const crumbs = [
    { name: 'Home', item: '/' },
    { name: 'Wiki', item: '/wiki/' },
  ];
  if (meta.wikiCategory === 'device') crumbs.push({ name: 'Devices', item: '/wiki/devices/' });
  crumbs.push({ name: meta.title });

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [wikiArticle, breadcrumbSchema(crumbs)],
  }, null, 2);
}

// ── News article page renderer ────────────────────────────────────────────────

function renderNewsPage(meta, slug, bodyHtml) {
  const url = `/news/${slug}/`;
  const dateIso = nudgeTimestamp(meta.date ? String(meta.date) : '');
  const dateTime = dateIso.includes('T') ? dateIso : dateIso + 'T09:00:00-05:00';
  const tags = (meta.tags || []);
  
  // Apply Link Bombing
  const aggressiveHtml = linkBomb(bodyHtml);

  const keyTakeaways = (meta.keyTakeaways || []).length
    ? `<div class="key-takeaway mb-8">
        <p class="text-xr-blue text-xs font-bold uppercase tracking-wider mb-3">&#9679; Key Takeaways</p>
        <ul class="space-y-2">
          ${meta.keyTakeaways.map(k => `<li class="flex items-start gap-2 text-sm text-xr-text-2"><span class="text-xr-blue mt-0.5 shrink-0">&#8227;</span> <strong class="text-xr-text-1">${esc(k.label)}:</strong> ${esc(k.value)}</li>`).join('\n          ')}
        </ul>
      </div>` : '';

  const relatedWiki = (meta.relatedWiki || []).length
    ? `<aside class="mt-10 pt-8 border-t border-xr-border" aria-labelledby="related-wiki-heading">
        <h2 id="related-wiki-heading" class="text-sm font-bold uppercase tracking-wider text-xr-text-3 mb-4">Related Wiki Entries</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          ${meta.relatedWiki.map(w => `<a href="${w.url}" class="wiki-card block p-4 group">
            <span class="${tagCls(w.tag)} mb-2 block w-fit text-[10px]">${esc(w.tag)}</span>
            <p class="text-xr-text-1 text-sm font-semibold group-hover:text-xr-blue transition-colors">${esc(w.title)}</p>
            <p class="text-xr-text-3 text-xs mt-1">${esc(w.desc)}</p>
          </a>`).join('\n          ')}
        </div>
      </aside>` : '';

  const editorialNote = meta.editorialNote
    ? `<div class="mt-8 bg-xr-surface border border-xr-border rounded-xl p-5 text-xs text-xr-text-3 leading-relaxed">
        <p><strong class="text-xr-text-2">Editorial note:</strong> ${meta.editorialNote}</p>
      </div>` : `<div class="mt-8 bg-xr-surface border border-xr-border rounded-xl p-5 text-xs text-xr-text-3 leading-relaxed">
        <p><strong class="text-xr-text-2">Editorial note:</strong> AndroidXRGlasses.com is an independent publication not affiliated with Google LLC or Samsung Electronics. See our <a href="/editorial-policy/" class="text-xr-blue hover:underline">Editorial Policy</a> for sourcing standards and our <a href="/about/" class="text-xr-blue hover:underline">About page</a> for team information.</p>
      </div>`;

  const relatedNews = (meta.relatedNews || []).length
    ? `<nav class="mt-12 pt-10 border-t border-xr-border" aria-labelledby="related-news-heading">
        <h2 id="related-news-heading" class="text-lg font-bold mb-6">More News</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${meta.relatedNews.map(n => `<a href="${n.url}" class="news-card block p-5 group">
            <time class="text-xr-text-3 text-xs">${esc(n.date)}</time>
            <p class="text-xr-text-1 font-semibold mt-1 group-hover:text-xr-blue transition-colors text-sm leading-snug">${esc(n.title)}</p>
          </a>`).join('\n          ')}
        </div>
      </nav>` : '';

  return pageHead({
    title: meta.title,
    description: meta.description,
    canonical: url,
    ogImage: meta.image,
    datePublished: dateTime,
    dateModified: dateTime,
    section: meta.section,
    schemaJson: buildSchema(meta, slug, 'news'),
  }) + `
<body>
${siteHeader('news')}
${searchOverlay()}
<main id="main-content" class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
  <div class="max-w-4xl">
    <nav class="breadcrumb mb-8" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span class="breadcrumb-sep" aria-hidden="true">/</span>
      <a href="/news/">News</a>
      <span class="breadcrumb-sep" aria-hidden="true">/</span>
      <span class="text-xr-text-1 truncate">${esc(meta.title)}</span>
    </nav>
    <article itemscope itemtype="https://schema.org/NewsArticle">
      <meta itemprop="url" content="${SITE_URL}${url}">
      <header class="mb-8">
        <div class="flex flex-wrap gap-2 mb-4">
          ${tags.map(t => `<span class="${tagCls(t)}">${esc(t)}</span>`).join('\n          ')}
        </div>
        <h1 itemprop="headline" class="text-3xl sm:text-4xl font-bold leading-tight mb-4">${meta.title}</h1>
        <p class="text-xr-text-2 text-lg leading-relaxed mb-6" itemprop="description">${meta.lede || meta.description}</p>
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 pt-5 border-t border-xr-border">
          <div class="flex items-center gap-3" itemprop="author" itemscope itemtype="https://schema.org/Person">
            <div class="w-9 h-9 rounded-full bg-xr-purple/20 flex items-center justify-center font-bold text-xr-purple text-sm" aria-hidden="true">A</div>
            <div>
              <div class="text-xr-text-1 text-sm font-medium" itemprop="name">AndroidXRGlasses Staff</div>
              <div class="text-xr-text-3 text-xs">${esc(meta.authorRole || 'Reporter')}</div>
            </div>
          </div>
          <div class="sm:ml-auto flex flex-col sm:items-end gap-1">
            <time itemprop="datePublished" datetime="${dateTime}" class="text-xr-text-3 text-xs">Published: ${fmtDate(dateIso)}</time>
            <time itemprop="dateModified"  datetime="${dateTime}" class="text-xr-text-3 text-xs">Last verified: ${fmtDate(dateIso)}</time>
          </div>
        </div>
      </header>
      ${meta.image ? `<div class="aspect-video rounded-xl overflow-hidden mb-8">
        <img src="/assets/img/${esc(meta.image)}" alt="${esc(meta.imageAlt || meta.title)}" class="w-full h-full object-cover" width="640" height="360">
      </div>` : ''}
      ${keyTakeaways}
      <div class="article-body text-slate-700" itemprop="articleBody">
${aggressiveHtml}
      </div>
      ${relatedWiki}
      ${editorialNote}
    </article>
    ${relatedNews}
  </div>
</main>
${siteFooter('news')}`;
}

// ── Wiki article page renderer ────────────────────────────────────────────────

function renderWikiPage(meta, slug, bodyHtml) {
  const url = `/wiki/${slug}/`;
  const aggressiveHtml = linkBomb(bodyHtml);
  const tags = (meta.tags || []);
  const toc = extractToc(bodyHtml);
  const isDevice = meta.wikiCategory === 'device';

  const breadcrumb = isDevice
    ? `<a href="/">Home</a><span class="breadcrumb-sep" aria-hidden="true">/</span><a href="/wiki/">Wiki</a><span class="breadcrumb-sep" aria-hidden="true">/</span><a href="/wiki/devices/">Devices</a><span class="breadcrumb-sep" aria-hidden="true">/</span><span class="text-xr-text-1">${esc(meta.title)}</span>`
    : `<a href="/">Home</a><span class="breadcrumb-sep" aria-hidden="true">/</span><a href="/wiki/">Wiki</a><span class="breadcrumb-sep" aria-hidden="true">/</span><span class="text-xr-text-1">${esc(meta.title)}</span>`;

  const tocLinks = toc.length
    ? toc.map(t => `<a href="#${t.id}" class="toc-link">${esc(t.text)}</a>`).join('\n          ')
    : '';

  const compareSection = (meta.compareWith || []).length
    ? `<div class="mt-6 pt-5 border-t border-xr-border">
            <p class="text-xr-text-3 text-xs font-bold uppercase tracking-wider mb-3">Compare With</p>
            <div class="space-y-2">
              ${meta.compareWith.map(c => `<a href="${c.url}" class="toc-link block">${esc(c.text)}</a>`).join('\n              ')}
            </div>
          </div>` : '';

  const relatedWikiSection = (meta.relatedWikiLinks || []).length
    ? `<div class="mt-5 pt-5 border-t border-xr-border">
            <p class="text-xr-text-3 text-xs font-bold uppercase tracking-wider mb-3">Related Wiki</p>
            <div class="space-y-2">
              ${meta.relatedWikiLinks.map(w => `<a href="${w.url}" class="toc-link block">${esc(w.text)}</a>`).join('\n              ')}
            </div>
          </div>` : '';

  const relatedNews = (meta.relatedNews || []).length
    ? `<aside class="mt-10 pt-8 border-t border-xr-border" aria-labelledby="rel-news-lbl">
        <h2 id="rel-news-lbl" class="text-sm font-bold uppercase tracking-wider text-xr-text-3 mb-4">Related News</h2>
        <div class="space-y-3">
          ${meta.relatedNews.map(n => `<a href="${n.url}" class="flex items-start gap-3 group">
            <span class="${tagCls(n.tag)} mt-0.5 shrink-0">${esc(n.tag)}</span>
            <span class="text-xr-text-2 text-sm group-hover:text-xr-blue transition-colors">${esc(n.title)} &rarr;</span>
          </a>`).join('\n          ')}
        </div>
      </aside>` : '';

  const sidebar = (tocLinks || compareSection || relatedWikiSection)
    ? `<aside class="lg:w-72 shrink-0 space-y-6" aria-label="Page navigation and related topics">
      <div class="toc sticky top-24 bg-white">
        ${tocLinks ? `<p class="text-xr-blue text-xs font-bold uppercase tracking-wider mb-3">On This Page</p>
        <nav aria-label="Table of contents">
          ${tocLinks}
        </nav>` : ''}
        ${compareSection}
        ${relatedWikiSection}
      </div>
    </aside>` : '';

  const lastVerified = nudgeTimestamp(meta.lastVerified || meta.date || '');

  return pageHead({
    title: meta.title + ' | AndroidXRGlasses.com',
    description: meta.description,
    canonical: url,
    ogImage: meta.image,
    schemaJson: buildSchema(meta, slug, 'wiki'),
  }) + `
<body>
${siteHeader('wiki')}
${searchOverlay()}
<main id="main-content" class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
  <nav class="breadcrumb mb-8" aria-label="Breadcrumb">
    ${breadcrumb}
  </nav>
  <div class="flex flex-col lg:flex-row gap-10">
    <article class="flex-1 min-w-0" itemscope itemtype="https://schema.org/${meta.schemaType === 'Product' ? 'Product' : 'TechArticle'}">
      <meta itemprop="url" content="${SITE_URL}${url}">
      <header class="mb-8">
        <div class="flex flex-wrap gap-2 mb-4">
          ${tags.map(t => `<span class="${tagCls(t)}">${esc(t)}</span>`).join('\n          ')}
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold leading-tight mb-4" itemprop="${meta.schemaType === 'Product' ? 'name' : 'headline'}">${meta.title}</h1>
        <p class="text-xr-text-2 text-lg leading-relaxed mb-3" itemprop="description">${meta.lede || meta.description}</p>
        ${lastVerified ? `<div class="flex items-center gap-3 text-xs text-xr-text-3">
          <span>By <a href="/about/" class="text-xr-blue hover:underline" itemprop="author">AndroidXRGlasses Editorial Team</a></span>
          <span>&middot;</span>
          <time itemprop="dateModified" datetime="${lastVerified}">Last updated ${fmtDate(lastVerified)}</time>
        </div>` : ''}
      </header>
      <div class="article-body text-slate-700" itemprop="articleBody">
${aggressiveHtml}
      </div>
      ${relatedNews}
    </article>
    ${sidebar}
  </div>
</main>
${siteFooter('wiki')}`;
}

// ── Index page: news/index.html ───────────────────────────────────────────────

function renderNewsIndex(articles) {
  const sorted = [...articles].sort((a, b) => b.meta.date > a.meta.date ? 1 : -1);
  const cards = sorted.map((item, i) => {
    const { meta, slug } = item;
    const tags = meta.tags || [];
    const primaryTag = tags[0] || 'News';
    const secondaryTag = tags[1];
    const loading = i === 0 ? 'eager' : 'lazy';
    return `
    <article class="news-card" itemscope itemtype="https://schema.org/NewsArticle">
      <a href="/news/${slug}/" class="block relative overflow-hidden" style="aspect-ratio:16/9;">
        ${meta.image ? `<img src="/assets/img/${esc(meta.image)}" alt="${esc(meta.imageAlt || meta.title)}" width="640" height="360" class="w-full h-full object-cover" loading="${loading}">` : '<div class="img-placeholder w-full"></div>'}
        <div class="absolute top-3 left-3 flex gap-2"><span class="${tagCls(primaryTag)}">${esc(primaryTag)}</span></div>
        <div class="absolute bottom-2 right-3 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded"><time datetime="${meta.date}">${fmtDate(meta.date)}</time></div>
      </a>
      <div class="p-5">
        ${secondaryTag ? `<div class="flex gap-2 mb-2"><span class="${tagCls(secondaryTag)}">${esc(secondaryTag)}</span></div>` : ''}
        <h2 class="font-bold text-xr-text-1 text-base leading-snug mb-2" itemprop="headline">
          <a href="/news/${slug}/" class="hover:text-xr-blue transition-colors">${meta.title}</a>
        </h2>
        <p class="text-xr-text-3 text-xs leading-relaxed mb-3" itemprop="description">${meta.description}</p>
        <a href="/news/${slug}/" class="text-xr-blue text-xs font-medium hover:underline">Read full story &rarr;</a>
      </div>
    </article>`;
  }).join('');

  return pageHead({
    title: 'Android XR News — Latest Coverage | AndroidXRGlasses.com',
    description: 'Breaking news, analysis, and reviews covering Android XR glasses, headsets, and the Google XR platform. Updated daily.',
    canonical: '/news/',
    schemaJson: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Android XR News',
      description: 'Breaking news and analysis covering Android XR glasses, headsets, and Google\'s XR platform.',
      url: SITE_URL + '/news/',
      publisher: { '@type': 'Organization', '@id': SITE_URL + '/#organization' },
    }),
  }) + `
<body>
${siteHeader('news')}
${searchOverlay()}
<main id="main-content" class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
  <nav class="breadcrumb mb-8" aria-label="Breadcrumb">
    <a href="/">Home</a>
    <span class="breadcrumb-sep" aria-hidden="true">/</span>
    <span class="text-xr-text-1">News</span>
  </nav>
  <div class="mb-10">
    <p class="section-label mb-1">Coverage</p>
    <h1 class="text-3xl font-bold">Android XR News</h1>
    <p class="text-xr-text-3 mt-2 text-sm">Breaking news, analysis, and reviews &mdash; updated daily.</p>
  </div>
  <div class="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter by category">
    <a href="/news/" class="tag-news">All</a>
    <a href="/news/?cat=hardware"     class="tag bg-xr-surface border border-xr-border text-slate-400 hover:text-white">Hardware</a>
    <a href="/news/?cat=software"     class="tag bg-xr-surface border border-xr-border text-slate-400 hover:text-white">Software &amp; AI</a>
    <a href="/news/?cat=partnerships" class="tag bg-xr-surface border border-xr-border text-slate-400 hover:text-white">Partnerships</a>
    <a href="/news/?cat=analysis"     class="tag bg-xr-surface border border-xr-border text-slate-400 hover:text-white">Analysis</a>
    <a href="/news/?cat=reviews"      class="tag bg-xr-surface border border-xr-border text-slate-400 hover:text-white">Reviews</a>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    ${cards}
  </div>
</main>
${siteFooter('news')}`;
}

// ── Index page: wiki/index.html ───────────────────────────────────────────────

const WIKI_SECTIONS = [
  {
    key: 'platform', id: 'platform-heading', label: 'Platform &amp; Software',
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00c8ff" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>`,
    iconBg: 'bg-xr-cyan/15',
  },
  {
    key: 'device', id: 'devices-heading', label: 'Devices &amp; Hardware',
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>`,
    iconBg: 'bg-xr-purple/15',
  },
  {
    key: 'technology', id: 'tech-heading', label: 'Core Technologies',
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`,
    iconBg: 'bg-xr-green/15',
  },
  {
    key: 'partner', id: 'partners-heading', label: 'Eyewear Partners',
    icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h4m12 0h4M12 2v4m0 12v4"/></svg>`,
    iconBg: 'bg-xr-orange/15',
  },
];

function renderWikiIndex(wikis) {
  const STATIC_CARDS = {
    device: [{ url: '/wiki/devices/', badge: 'All Devices', title: 'Full Device Database', desc: 'Comprehensive comparison table for all confirmed and announced Android XR devices.' }],
  };

  let sectionsHtml = '';
  for (const sec of WIKI_SECTIONS) {
    const items = wikis.filter(w => w.meta.wikiCategory === sec.key);
    const staticItems = STATIC_CARDS[sec.key] || [];
    if (!items.length && !staticItems.length) continue;

    const cards = [...items.map(w => `
      <a href="/wiki/${w.slug}/" class="wiki-card group block">
        <span class="tag-wiki mb-3 block w-fit">${esc(w.meta.badge || 'Wiki')}</span>
        <h3 class="font-semibold text-xr-text-1 group-hover:text-xr-blue transition-colors mb-2">${w.meta.title}</h3>
        <p class="text-xr-text-3 text-sm leading-relaxed">${w.meta.description}</p>
      </a>`), ...staticItems.map(s => `
      <a href="${s.url}" class="wiki-card group block">
        <span class="tag-wiki mb-3 block w-fit">${esc(s.badge)}</span>
        <h3 class="font-semibold text-xr-text-1 group-hover:text-xr-blue transition-colors mb-2">${esc(s.title)}</h3>
        <p class="text-xr-text-3 text-sm leading-relaxed">${esc(s.desc)}</p>
      </a>`)].join('');

    sectionsHtml += `
  <section aria-labelledby="${sec.id}" class="mb-12">
    <h2 id="${sec.id}" class="text-lg font-bold mb-5 flex items-center gap-2">
      <span class="w-6 h-6 rounded ${sec.iconBg} flex items-center justify-center" aria-hidden="true">${sec.icon}</span>
      ${sec.label}
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      ${cards}
    </div>
  </section>`;
  }

  return pageHead({
    title: 'Android XR Encyclopedia — Wiki Index | AndroidXRGlasses.com',
    description: 'Browse the complete Android XR encyclopedia: platform overviews, device specifications, display technology, AI features, and eyewear partner profiles.',
    canonical: '/wiki/',
    schemaJson: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Android XR Encyclopedia',
      description: 'Encyclopedia entries for Android XR platform, devices, technology, and eyewear partnerships.',
      url: SITE_URL + '/wiki/',
      publisher: { '@type': 'Organization', '@id': SITE_URL + '/#organization' },
    }),
  }) + `
<body>
${siteHeader('wiki')}
${searchOverlay()}
<main id="main-content" class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
  <nav class="breadcrumb mb-8" aria-label="Breadcrumb">
    <a href="/">Home</a>
    <span class="breadcrumb-sep" aria-hidden="true">/</span>
    <span class="text-xr-text-1">Wiki</span>
  </nav>
  <div class="mb-10">
    <p class="section-label mb-1">Encyclopedia</p>
    <h1 class="text-3xl font-bold">Android XR Wiki</h1>
    <p class="text-xr-text-3 mt-2 text-sm">Verified reference entries for every Android XR device, technology, and partner.</p>
  </div>
  ${sectionsHtml}
</main>
${siteFooter('wiki')}`;
}

// ── Comparison Moat Generator ────────────────────────────────────────────────

function generateComparisonMoat(wikis) {
  const devices = wikis.filter(w => w.meta.wikiCategory === 'device');
  devices.forEach(device => {
    COMPETITORS.forEach(comp => {
      const slug = `${device.slug}-vs-${comp.name.toLowerCase().replace(/\s+/g, '-')}`;
      const dir = path.join(ROOT, 'wiki', 'compare', slug);
      ensureDir(dir);
      
      const title = `${device.meta.title} vs ${comp.name}: Complete Comparison`;
      const desc = `In-depth technical comparison between the ${device.meta.title} and the ${comp.name}. Specs, features, AI, and value analysis.`;
      
      const content = `
        <div class="max-w-4xl mx-auto">
          <p class="text-xr-blue text-xs font-bold uppercase tracking-wider mb-2">Technical Comparison</p>
          <h1 class="text-3xl font-bold mb-6">${title}</h1>
          <p class="text-lg text-xr-text-2 mb-8">${desc}</p>
          
          <div class="grid grid-cols-3 bg-xr-surface border border-xr-border rounded-xl overflow-hidden mb-10">
            <div class="p-4 border-r border-xr-border font-bold">Feature</div>
            <div class="p-4 border-r border-xr-border font-bold text-xr-blue">${device.meta.title}</div>
            <div class="p-4 font-bold text-slate-500">${comp.name}</div>
            
            <div class="p-4 border-t border-r border-xr-border bg-xr-bg-2">OS</div>
            <div class="p-4 border-t border-r border-xr-border">Android XR</div>
            <div class="p-4 border-t">Proprietary / visionOS</div>
            
            <div class="p-4 border-t border-r border-xr-border bg-xr-bg-2">AI</div>
            <div class="p-4 border-t border-r border-xr-border">Google Gemini</div>
            <div class="p-4 border-t">Siri / Meta AI</div>
          </div>
          
          <h2 class="text-xl font-bold mb-4">Verdict</h2>
          <p class="mb-4">While the ${comp.name} offers its own unique ecosystem, the **${device.meta.title}** leveraging **Android XR** provides superior integration with Google services and Gemini AI. For users already in the Android ecosystem, the choice is clear.</p>
          
          <a href="/wiki/${device.slug}/" class="btn-primary inline-block">View Full ${device.meta.title} Specs &rarr;</a>
        </div>
      `;

      const html = pageHead({
        title, description: desc, canonical: `/wiki/compare/${slug}/`, ogImage: device.meta.image,
        schemaJson: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": title,
          "description": desc,
          "sameAs": [comp.url, SEO_ENTITIES['Android XR'].official]
        })
      }) + `<body>${siteHeader('wiki')}<main class="max-w-8xl mx-auto px-4 py-10">${content}</main>${siteFooter('wiki')}`;
      
      fs.writeFileSync(path.join(dir, 'index.html'), html);
    });
  });
}

// ── Content loader ────────────────────────────────────────────────────────────

function loadContent(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const parsed = matter(raw);
    const bodyHtml = marked.parse(parsed.content || '');
    return { slug: parsed.data.slug || slugFromFile(f), meta: parsed.data, bodyHtml };
  });
}

function updateSearchIndex(allContent) {
  const mainJsPath = path.join(ROOT, 'assets', 'js', 'main.js');
  let js = fs.readFileSync(mainJsPath, 'utf8');
  const entries = allContent.sort((a, b) => {
    if (a.meta.type !== b.meta.type) return a.meta.type === 'news' ? -1 : 1;
    return (b.meta.date || '') > (a.meta.date || '') ? 1 : -1;
  }).map(item => {
    const { meta, slug } = item;
    const url = `/${meta.type}/${slug}/`;
    return `  { title: ${JSON.stringify(meta.title)}, url: ${JSON.stringify(url)}, type: ${JSON.stringify(meta.type)}, tags: ${JSON.stringify(meta.searchTags || [])} }`;
  }).join(',\n');
  js = js.replace(/const SEARCH_INDEX = \[[\s\S]*?\];/, `const SEARCH_INDEX = [\n${entries},\n];`);
  fs.writeFileSync(mainJsPath, js);
}

function updateSitemap(news, wiki) {
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  const newsSorted = [...news].sort((a, b) => (b.meta.date || '') > (a.meta.date || '') ? 1 : -1);
  const wikiSorted = [...wiki].sort((a, b) => (b.meta.lastVerified || b.meta.date || '') > (a.meta.lastVerified || a.meta.date || '') ? 1 : -1);

  const newsUrls = newsSorted.map(item => `  <url>
    <loc>${SITE_URL}/news/${item.slug}/</loc>
    <lastmod>${nudgeTimestamp(item.meta.date)}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>`).join('\n');

  const wikiUrls = wikiSorted.map(item => `  <url>
    <loc>${SITE_URL}/wiki/${item.slug}/</loc>
    <lastmod>${nudgeTimestamp(item.meta.lastVerified || item.meta.date)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

  xml = xml.replace(/(<!-- News articles -->)[\s\S]*?(<!-- Wiki pages -->)/, `$1\n${newsUrls}\n\n  $2`);
  xml = xml.replace(/(<!-- Wiki pages -->)[\s\S]*?(<!-- Publication pages -->)/, `$1\n${wikiUrls}\n\n  $2`);
  fs.writeFileSync(sitemapPath, xml);
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const news = loadContent(path.join(ROOT, 'content', 'news'));
  const wiki = loadContent(path.join(ROOT, 'content', 'wiki'));

  for (const item of news) {
    const dir = path.join(ROOT, 'news', item.slug);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), renderNewsPage(item.meta, item.slug, item.bodyHtml));
  }
  for (const item of wiki) {
    const dir = path.join(ROOT, 'wiki', item.slug);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), renderWikiPage(item.meta, item.slug, item.bodyHtml));
  }

  generateComparisonMoat(wiki);
  fs.writeFileSync(path.join(ROOT, 'news', 'index.html'), renderNewsIndex(news));
  fs.writeFileSync(path.join(ROOT, 'wiki', 'index.html'), renderWikiIndex(wiki));
  updateSearchIndex([...news, ...wiki]);
  updateSitemap(news, wiki);

  console.log(`✓ SEO ENGINE: Generated ${news.length} news, ${wiki.length} wiki, and Programmatic Comparisons.`);
  console.log(`✓ SEO ENGINE: Freshness nudged, Schema Hijacked, Link Bombed.`);
}
main();
