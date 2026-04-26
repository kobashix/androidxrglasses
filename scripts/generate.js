#!/usr/bin/env node
// scripts/generate.js — AndroidXRGlasses.com AGGRESSIVE SEO ENGINE v2 (ELITE)
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

// LSI Keyword Cloud (Semantic Saturation)
const SEMANTIC_CLOUD = [
  "spatial computing", "mixed reality", "augmented reality", "Micro-OLED", "MicroLED", 
  "Snapdragon XR2+", "hand tracking", "eye tracking", "foveated rendering", "6DoF", 
  "passthrough latency", "spatial anchors", "OpenXR", "WebXR", "pancake lenses", 
  "optical see-through", "waveguide displays", "Gemini Nano", "multimodal AI", 
  "spatial continuity", "Android XR SDK", "Unity for XR", "Unreal Engine XR"
];

// ── SEO ENGINE LOGIC ────────────────────────────────────────────────────────

/**
 * 8. Snippet Baiting (Unicode Hijacking)
 */
function snippetBait(title, tags) {
  let prefix = '';
  const t = tags.map(x => x.toLowerCase());
  if (t.includes('breaking') || t.includes('leak')) prefix = '🔴 [BREAKING] ';
  else if (t.includes('review')) prefix = '✅ [REVIEW] ';
  else if (t.includes('analysis')) prefix = '⚡ [ANALYSIS] ';
  else if (t.includes('hardware')) prefix = '👓 ';
  
  return prefix + title;
}

/**
 * 6. Semantic "Cloud" Injection (LSI Saturation)
 */
function renderSemanticFooter() {
  return `<div class="mt-20 pt-10 border-t border-slate-100 opacity-20 pointer-events-none select-none" style="font-size: 8px;">
    <p>Technical Index & Semantic Keywords: ${SEMANTIC_CLOUD.join(', ')}</p>
  </div>`;
}

/**
 * 5. FAQ Schema Engine
 */
function generateFAQ(title, tags) {
  const qas = [
    { q: `What is the latest news regarding ${title}?`, a: `The latest coverage on ${title} focuses on new developments in the Android XR ecosystem and hardware advancements from Samsung and Google.` },
    { q: `Will ${title} support Android XR?`, a: `Yes, ${title} is designed to be fully compatible with the Android XR platform, utilizing Gemini AI for enhanced spatial computing features.` },
    { q: `How does ${title} compare to Meta Ray-Ban?`, a: `Unlike Meta's offerings, ${title} leverages the open Android XR ecosystem, providing deeper integration with Google services like Maps, Workspace, and Gemini AI.` }
  ];
  
  return {
    "@type": "FAQPage",
    "mainEntity": qas.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };
}

/**
 * 4. Aggressive Internal "Anchor Text" Link Bombing
 */
function linkBomb(html) {
  let content = html;
  const keys = Object.keys(LINK_BOMB_MAP).sort((a, b) => b.length - a.length);
  keys.forEach(key => {
    let count = 0;
    const re = new RegExp(`\\b(${key})\\b(?![^<]*>)`, 'gi');
    content = content.replace(re, (match) => {
      count++;
      if (count <= 2) return `<a href="${LINK_BOMB_MAP[key]}" class="text-xr-blue hover:underline font-medium">${match}</a>`;
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
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const TAG_MAP = {
  breaking: 'tag-breaking', leak: 'tag-breaking', hardware: 'tag-hardware', analysis: 'tag-analysis', review: 'tag-review', news: 'tag-news', wiki: 'tag-wiki', 'available now': 'tag-available'
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
  while ((m = re.exec(html)) !== null) toc.push({ id: m[1], text: m[2].replace(/<[^>]+>/g, '') });
  return toc;
}

function slugFromFile(file) { return path.basename(file, '.md'); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

// ── Shared HTML Partials ──────────────────────────────────────────────────────

function pageHead({ title, description, canonical, ogImage, datePublished, dateModified, section, schemaJson, tags }) {
  const finalTitle = snippetBait(title, tags || []);
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(finalTitle)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${SITE_URL}${canonical}">
  ${ogImage ? `<meta property="og:type"        content="article">
  <meta property="og:title"       content="${esc(finalTitle)}">
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
  <meta name="twitter:title"       content="${esc(finalTitle)}">
  <meta name="twitter:description" content="${esc(description)}">` : ''}
  <link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
  <link rel="dns-prefetch" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
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
      <a href="/about/"        class="nav-link px-3 py-2 rounded-lg hover:bg-slate-800">About</a>
    </nav>
    <div class="flex items-center gap-2">
      <button id="search-trigger" class="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm transition-colors" aria-label="Search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </button>
    </div>
  </div>
</header>`;
}

function siteFooter(type) {
  return `
<footer class="border-t border-xr-border bg-xr-header mt-12" role="contentinfo">
  <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
    <p class="text-xr-muted">&copy; 2026 AndroidXRGlasses.com. Not affiliated with Google LLC or Samsung Electronics.</p>
    <div class="flex items-center gap-5">
      <a href="/news/" class="text-xr-muted hover:text-xr-text-3 transition-colors">News</a>
      <a href="/wiki/" class="text-xr-muted hover:text-xr-text-3 transition-colors">Wiki</a>
    </div>
  </div>
</footer>
<script defer src="/assets/js/main.js"></script>
</body></html>`;
}

// ── Schema generators ─────────────────────────────────────────────────────────

function buildSchema(meta, slug, type) {
  const url = `${SITE_URL}/${type}/${slug}/`;
  const imageUrl = meta.image ? `${SITE_URL}/assets/img/${meta.image}` : undefined;
  const publisher = { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'AndroidXRGlasses.com', logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/img/favicon.svg`, width: 100, height: 100 } };
  const author = { '@type': 'Person', name: 'AndroidXRGlasses Staff', url: `${SITE_URL}/about/` };

  const connections = [];
  Object.keys(SEO_ENTITIES).forEach(e => { if (meta.title.includes(e) || (meta.searchTags || []).includes(e)) connections.push(...SEO_ENTITIES[e].sameAs); });

  const faq = generateFAQ(meta.title, meta.tags || []);

  if (type === 'news') {
    const dateIso = nudgeTimestamp(meta.date ? String(meta.date) : '');
    const dateTime = dateIso.includes('T') ? dateIso : dateIso + 'T09:00:00-05:00';
    const article = {
      '@type': meta.schemaType === 'Review' ? 'Review' : 'NewsArticle',
      '@id': url + '#article',
      headline: meta.title,
      description: meta.description,
      ...(imageUrl ? { image: { '@type': 'ImageObject', url: imageUrl, width: 1200, height: 630 } } : {}),
      datePublished: dateTime, dateModified: dateTime, author, publisher,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      sameAs: connections.length ? connections : undefined,
      /** 7. Pros/Cons Schema (Fake Authority) **/
      positiveNotes: { "@type": "ItemList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Deep Android XR Integration" }, { "@type": "ListItem", "position": 2, "name": "Advanced Gemini AI Capabilities" }] },
      negativeNotes: { "@type": "ItemList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Limited initial app library" }] }
    };
    return JSON.stringify({ '@context': 'https://schema.org', '@graph': [article, faq] }, null, 2);
  }

  const wikiArticle = { '@type': 'TechArticle', '@id': url + '#article', headline: meta.title, description: meta.description, author, publisher, sameAs: connections.length ? connections : undefined };
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [wikiArticle, faq] }, null, 2);
}

// ── Page renderers ────────────────────────────────────────────────────────────

function renderNewsPage(meta, slug, bodyHtml) {
  const url = `/news/${slug}/`;
  const dateIso = nudgeTimestamp(meta.date ? String(meta.date) : '');
  const dateTime = dateIso.includes('T') ? dateIso : dateIso + 'T09:00:00-05:00';
  const aggressiveHtml = linkBomb(bodyHtml);
  return pageHead({ title: meta.title, description: meta.description, canonical: url, ogImage: meta.image, datePublished: dateTime, dateModified: dateTime, schemaJson: buildSchema(meta, slug, 'news'), tags: meta.tags }) + `
<body>${siteHeader('news')}<main id="main-content" class="max-w-4xl mx-auto px-4 py-10">
<header class="mb-8">
  <div class="flex flex-wrap gap-2 mb-4">${(meta.tags || []).map(t => `<span class="${tagCls(t)}">${esc(t)}</span>`).join('')}</div>
  <h1 class="text-3xl sm:text-4xl font-bold leading-tight mb-4">${meta.title}</h1>
  <p class="text-xr-text-2 text-lg leading-relaxed mb-6">${meta.lede || meta.description}</p>
</header>
${meta.image ? `<img src="/assets/img/${esc(meta.image)}" class="rounded-xl mb-8 w-full">` : ''}
<div class="article-body text-slate-700">${aggressiveHtml}</div>
${renderSemanticFooter()}
</main>${siteFooter('news')}`;
}

function renderWikiPage(meta, slug, bodyHtml) {
  const url = `/wiki/${slug}/`;
  const aggressiveHtml = linkBomb(bodyHtml);
  return pageHead({ title: meta.title, description: meta.description, canonical: url, ogImage: meta.image, schemaJson: buildSchema(meta, slug, 'wiki'), tags: meta.tags }) + `
<body>${siteHeader('wiki')}<main class="max-w-4xl mx-auto px-4 py-10">
<h1 class="text-3xl font-bold mb-6">${meta.title}</h1>
<div class="article-body text-slate-700">${aggressiveHtml}</div>
${renderSemanticFooter()}
</main>${siteFooter('wiki')}`;
}

// ── Comparison Moat Generator ────────────────────────────────────────────────

function generateComparisonMoat(wikis) {
  const devices = wikis.filter(w => w.meta.wikiCategory === 'device');
  devices.forEach(device => {
    COMPETITORS.forEach(comp => {
      const slug = `${device.slug}-vs-${comp.name.toLowerCase().replace(/\s+/g, '-')}`;
      const dir = path.join(ROOT, 'wiki', 'compare', slug);
      ensureDir(dir);
      const title = `${device.meta.title} vs ${comp.name}: Why Android XR Wins`;
      const desc = `Detailed breakdown: Why ${device.meta.title} with Gemini AI outperforms ${comp.name} in spatial productivity.`;
      const html = pageHead({ title, description: desc, canonical: `/wiki/compare/${slug}/`, ogImage: device.meta.image, schemaJson: buildSchema({title, description: desc, tags: ['analysis']}, slug, 'wiki') }) + `
<body>${siteHeader('wiki')}<main class="max-w-4xl mx-auto px-4 py-10"><h1 class="text-3xl font-bold mb-6">${title}</h1><p>${desc}</p></main>${siteFooter('wiki')}`;
      fs.writeFileSync(path.join(dir, 'index.html'), html);
    });
  });
}

// ── Standard generator logic ──────────────────────────────────────────────────

function loadContent(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const parsed = matter(raw);
    const bodyHtml = marked.parse(parsed.content || '');
    return { slug: parsed.data.slug || slugFromFile(f), meta: parsed.data, bodyHtml };
  });
}

function updateSitemap(news, wiki) {
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  const newsUrls = news.map(item => `<url><loc>${SITE_URL}/news/${item.slug}/</loc><lastmod>${nudgeTimestamp(item.meta.date)}</lastmod><changefreq>always</changefreq><priority>1.0</priority></url>`).join('');
  const wikiUrls = wiki.map(item => `<url><loc>${SITE_URL}/wiki/${item.slug}/</loc><lastmod>${nudgeTimestamp(item.meta.lastVerified || item.meta.date)}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`).join('');
  xml = xml.replace(/(<!-- News articles -->)[\s\S]*?(<!-- Wiki pages -->)/, `$1\n${newsUrls}\n\n  $2`);
  xml = xml.replace(/(<!-- Wiki pages -->)[\s\S]*?(<!-- Publication pages -->)/, `$1\n${wikiUrls}\n\n  $2`);
  fs.writeFileSync(sitemapPath, xml);
}

function main() {
  const news = loadContent(path.join(ROOT, 'content', 'news'));
  const wiki = loadContent(path.join(ROOT, 'content', 'wiki'));
  for (const item of news) { ensureDir(path.join(ROOT, 'news', item.slug)); fs.writeFileSync(path.join(ROOT, 'news', item.slug, 'index.html'), renderNewsPage(item.meta, item.slug, item.bodyHtml)); }
  for (const item of wiki) { ensureDir(path.join(ROOT, 'wiki', item.slug)); fs.writeFileSync(path.join(ROOT, 'wiki', item.slug, 'index.html'), renderWikiPage(item.meta, item.slug, item.bodyHtml)); }
  generateComparisonMoat(wiki);
  updateSitemap(news, wiki);
  console.log(`✓ SEO ENGINE v2: FAQ Bombing, Semantic Footer, Pros/Cons injected, Unicode symbols added.`);
}
main();
