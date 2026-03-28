/* sw.js — Numerologie v8.9 FINAL */
'use strict';

// Automatische Cache-Version mit Zeitstempel für Cache-Busting
const CACHE_VERSION = 'v8.9.0';
const CACHE_NAME = `numerologie-${CACHE_VERSION}`;
const FONT_CACHE = `numerologie-fonts-${CACHE_VERSION}`;

const APP_SHELL = [
  '/',
  '/index.html',
  '/style.css',
  '/numerology.js',
  '/manifest.json',
  '/impressum.html',
  '/datenschutz.html',
  '/nutzungsbedingungen.html',
  '/404.html',
  '/faq.html',
  '/robots.txt',
  '/sitemap.xml',
  '/assets/js/offline-indicator.js',
];

/* ── Install: cache app shell ── */
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .catch(err => {
        console.error('[SW] Cache installation failed:', err);
        /* Don't fail install if a file is missing */
      })
  );
});

/* ── Activate: purge old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== FONT_CACHE)
          .map(k => {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          })
      )
    ).then(() => {
      console.log('[SW] Activated, version:', CACHE_VERSION);
      return self.clients.claim();
    })
  );
});

/* ── Fetch: network-first with cache fallback ── */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = event.request.url;

  /* Fonts: cache-first (they rarely change) */
  if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(FONT_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(res => {
            if (res?.ok) cache.put(event.request, res.clone());
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  /* App shell + assets: network-first, cache fallback */
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return res;
      })
      .catch(() =>
        caches.match(event.request).then(cached => {
          if (cached) return cached;
          /* Offline fallback for navigation */
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        })
      )
  );
});




