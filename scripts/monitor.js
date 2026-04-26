#!/usr/bin/env node
// scripts/monitor.js — AndroidXRGlasses.com SUCCESS MONITOR
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STATS_FILE = path.join(ROOT, 'seo-stats.json');

async function runAudit() {
  console.log('🔍 RUNNING SEO SUCCESS AUDIT...');
  
  const news = fs.readdirSync(path.join(ROOT, 'news')).filter(f => fs.lstatSync(path.join(ROOT, 'news', f)).isDirectory()).length;
  const wiki = fs.readdirSync(path.join(ROOT, 'wiki')).filter(f => fs.lstatSync(path.join(ROOT, 'wiki', f)).isDirectory()).length;
  const comparisons = fs.existsSync(path.join(ROOT, 'wiki', 'compare')) ? fs.readdirSync(path.join(ROOT, 'wiki', 'compare')).filter(f => fs.lstatSync(path.join(ROOT, 'wiki', 'compare', f)).isDirectory()).length : 0;
  
  // Detailed Checks
  const sitemapExists = fs.existsSync(path.join(ROOT, 'sitemap.xml'));
  const newsSitemapExists = fs.existsSync(path.join(ROOT, 'sitemaps', 'news-sitemap.xml'));
  const robotsExists = fs.existsSync(path.join(ROOT, 'robots.txt'));
  const cssSize = fs.existsSync(path.join(ROOT, 'assets', 'css', 'tailwind.css')) ? fs.statSync(path.join(ROOT, 'assets', 'css', 'tailwind.css')).size : 0;
  
  const sitemapContent = sitemapExists ? fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8') : '';
  const sitemapUrlCount = (sitemapContent.match(/<url>/g) || []).length;

  const stats = {
    timestamp: new Date().toISOString(),
    content: {
      news_articles: news,
      wiki_entries: wiki,
      comparison_pages: comparisons,
      total_indexed_paths: news + wiki + comparisons
    },
    technical_health: {
      sitemap_ok: sitemapExists,
      news_sitemap_ok: newsSitemapExists,
      robots_ok: robotsExists,
      sitemap_urls: sitemapUrlCount,
      css_minified_size: `${(cssSize / 1024).toFixed(1)}KB`
    },
    engine_state: "ACTIVE",
    freshness: "OPTIMIZED"
  };

  // Load history
  let history = [];
  if (fs.existsSync(STATS_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
    } catch (e) {
      history = [];
    }
  }
  
  history.push(stats);
  // Keep last 30 audits
  if (history.length > 30) history.shift();
  
  fs.writeFileSync(STATS_FILE, JSON.stringify(history, null, 2));
  
  console.log(`✅ AUDIT COMPLETE.`);
  console.log(`📈 FOOTPRINT: ${stats.content.total_indexed_paths} pages | SITEMAP: ${sitemapUrlCount} URLs | CSS: ${stats.technical_health.css_minified_size}`);
}

runAudit();
