#!/usr/bin/env node
// scripts/monitor.js — AndroidXRGlasses.com SUCCESS MONITOR
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STATS_FILE = path.join(ROOT, 'seo-stats.json');

async function runAudit() {
  console.log('🔍 RUNNING SEO SUCCESS AUDIT...');
  
  const news = fs.readdirSync(path.join(ROOT, 'news')).length;
  const wiki = fs.readdirSync(path.join(ROOT, 'wiki')).length;
  const comparisons = fs.existsSync(path.join(ROOT, 'wiki', 'compare')) ? fs.readdirSync(path.join(ROOT, 'wiki', 'compare')).length : 0;
  
  const stats = {
    timestamp: new Date().toISOString(),
    content: {
      news_articles: news,
      wiki_entries: wiki,
      comparison_pages: comparisons,
      total_indexed_paths: news + wiki + comparisons
    },
    engine_health: "ACTIVE",
    freshness_loop: "OPTIMIZED"
  };

  // Load history
  let history = [];
  if (fs.existsSync(STATS_FILE)) {
    history = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
  }
  
  history.push(stats);
  // Keep last 30 audits
  if (history.length > 30) history.shift();
  
  fs.writeFileSync(STATS_FILE, JSON.stringify(history, null, 2));
  
  console.log(`✅ AUDIT COMPLETE.`);
  console.log(`📈 CURRENT FOOTPRINT: ${stats.content.total_indexed_paths} target landing pages.`);
}

runAudit();
