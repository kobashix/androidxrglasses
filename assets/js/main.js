/* AndroidXRGlasses.com — main.js
   Minimal, no-framework JS for search, mobile menu, and UX enhancements.
   All interactions are progressive enhancements — the site works without JS. */

'use strict';

// ─── Search ────────────────────────────────────────────────────────────────
const SEARCH_INDEX = [
  // News
  { title: 'Samsung Android XR Glasses Confirmed for H2 2026', url: '/news/samsung-android-xr-glasses-2026/', type: 'news', tags: ['Samsung', 'glasses', '2026'] },
  { title: 'CES 2026: Smart Glasses Everywhere, But Android XR Looms Largest', url: '/news/ces-2026-android-xr-smart-glasses/', type: 'news', tags: ['CES', 'smart glasses'] },
  { title: "Google's $150M Warby Parker Bet: Inside the Android XR Strategy", url: '/news/google-warby-parker-150m-android-xr/', type: 'news', tags: ['Warby Parker', 'Google', 'investment'] },
  { title: 'Gucci, Balenciaga & Alexander McQueen Coming to Android XR', url: '/news/kering-eyewear-android-xr-gucci/', type: 'news', tags: ['Kering', 'Gucci', 'Balenciaga'] },
  { title: 'Samsung Galaxy XR Review: The First Android XR Device', url: '/news/samsung-galaxy-xr-review/', type: 'news', tags: ['review', 'Samsung', 'Galaxy XR'] },
  // Wiki
  { title: 'Android XR Platform — Complete Technical Reference', url: '/wiki/android-xr-platform/', type: 'wiki', tags: ['platform', 'Google', 'OS'] },
  { title: 'Samsung Galaxy XR — Full Specifications', url: '/wiki/samsung-galaxy-xr/', type: 'wiki', tags: ['Samsung', 'headset', 'specs'] },
  { title: 'XREAL Project Aura — Specifications & Overview', url: '/wiki/xreal-project-aura/', type: 'wiki', tags: ['XREAL', 'AR', 'glasses'] },
  { title: 'Gemini AI on Android XR — Features & Integration', url: '/wiki/gemini-ai-android-xr/', type: 'wiki', tags: ['Gemini', 'AI', 'Google'] },
  { title: 'Raxium MicroLED Technology — Display Deep Dive', url: '/wiki/raxium-microled/', type: 'wiki', tags: ['Raxium', 'MicroLED', 'display'] },
  { title: 'Device Database — All Android XR Devices', url: '/wiki/devices/', type: 'wiki', tags: ['devices', 'database', 'comparison'] },
  { title: 'Warby Parker × Android XR Partnership', url: '/wiki/warby-parker-android-xr/', type: 'wiki', tags: ['Warby Parker', 'glasses', 'partnership'] },
  { title: 'Gentle Monster × Android XR Partnership', url: '/wiki/gentle-monster-android-xr/', type: 'wiki', tags: ['Gentle Monster', 'glasses', 'fashion'] },
];

function initSearch() {
  const trigger   = document.getElementById('search-trigger');
  const overlay   = document.getElementById('search-overlay');
  const input     = document.getElementById('search-input');
  const closeBtn  = document.getElementById('search-close');
  const results   = document.getElementById('search-results');
  if (!trigger || !overlay) return;

  function openSearch() {
    overlay.classList.remove('hidden');
    input.focus();
    document.body.style.overflow = 'hidden';
    trigger.setAttribute('aria-expanded', 'true');
  }

  function closeSearch() {
    overlay.classList.add('hidden');
    input.value = '';
    renderResults('');
    document.body.style.overflow = '';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();
  }

  function renderResults(query) {
    if (!query.trim()) {
      results.innerHTML = '<p class="text-xr-text-3 text-sm text-center py-6">Start typing to search news, devices, and wiki pages&hellip;</p>';
      return;
    }
    const q = query.toLowerCase();
    const hits = SEARCH_INDEX.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 8);

    if (!hits.length) {
      results.innerHTML = `<p class="text-xr-text-3 text-sm text-center py-6">No results for "<strong class="text-xr-text-1">${escHtml(query)}</strong>"</p>`;
      return;
    }

    results.innerHTML = hits.map(item => `
      <a href="${item.url}" class="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-xr-surface-2 transition-colors group block">
        <span class="${item.type === 'news' ? 'tag-news' : 'tag-wiki'} shrink-0 mt-0.5">${item.type}</span>
        <span class="text-xr-text-1 text-sm group-hover:text-xr-cyan transition-colors">${escHtml(item.title)}</span>
      </a>
    `).join('');
  }

  trigger.addEventListener('click', openSearch);
  closeBtn.addEventListener('click', closeSearch);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });
  input.addEventListener('input', e => renderResults(e.target.value));
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeSearch();
  });
}

// ─── Mobile Menu ──────────────────────────────────────────────────────────
function initMobileMenu() {
  const btn  = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!open));
  });
}

// ─── Active nav link ──────────────────────────────────────────────────────
function markActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href !== '/' && path.startsWith(href)) {
      a.classList.add('text-xr-text-1');
      a.setAttribute('aria-current', 'page');
    }
  });
}

// ─── Utility ─────────────────────────────────────────────────────────────
function escHtml(str) {
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ─── Init ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initMobileMenu();
  markActiveNav();
});
