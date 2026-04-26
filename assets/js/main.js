/* AndroidXRGlasses.com — main.js
   Minimal, no-framework JS for search, mobile menu, and UX enhancements.
   All interactions are progressive enhancements — the site works without JS. */

'use strict';

// ─── Search ────────────────────────────────────────────────────────────────
const SEARCH_INDEX = [
  { title: "Google I/O 2026 Preview: Android XR 2.0, Gemini 2.0, and the 'Aura' Glasses Revolution", url: "/news/google-io-2026-preview-android-xr/", type: "news", tags: ["Google I/O",2026,"Android XR 2.0","Gemini 2.0","smart glasses","rumors"] },
  { title: "Samsung Android XR Glasses Confirmed for H2 2026: 12MP Camera, Gesture Controls, Two Models", url: "/news/samsung-android-xr-glasses-2026/", type: "news", tags: ["Samsung","Android XR","smart glasses",2026,"Qualcomm","Gemini AI"] },
  { title: "CES 2026: Smart Glasses Everywhere, But Android XR's Promise Looms Largest", url: "/news/ces-2026-android-xr-smart-glasses/", type: "news", tags: ["CES 2026","Android XR","smart glasses","XREAL","Meta"] },
  { title: "Google's $150M Warby Parker Bet: Inside the Android XR Eyewear Strategy", url: "/news/google-warby-parker-150m-android-xr/", type: "news", tags: ["Warby Parker","Google","Android XR","investment","eyewear"] },
  { title: "Gucci, Balenciaga & Alexander McQueen Glasses Are Coming to Android XR", url: "/news/kering-eyewear-android-xr-gucci/", type: "news", tags: ["Kering","Gucci","Balenciaga","Android XR","fashion","luxury"] },
  { title: "Samsung Galaxy XR Review: The First Android XR Device Is Here — At a Price", url: "/news/samsung-galaxy-xr-review/", type: "news", tags: ["review","Samsung","Galaxy XR","headset"] },
  { title: "Qualcomm Snapdragon XR2+ Gen 3", url: "/wiki/snapdragon-xr2-plus-gen-3/", type: "wiki", tags: ["Qualcomm","Snapdragon XR2+ Gen 3","chipset","processor","specs"] },
  { title: "Samsung Galaxy XR", url: "/wiki/samsung-galaxy-xr/", type: "wiki", tags: ["Samsung","Galaxy XR","headset","specs","price"] },
  { title: "Android XR Platform", url: "/wiki/android-xr-platform/", type: "wiki", tags: ["Android XR","platform","Google","OS","architecture"] },
  { title: "Raxium MicroLED Technology", url: "/wiki/raxium-microled/", type: "wiki", tags: ["Raxium","MicroLED","display","Google","technology"] },
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
