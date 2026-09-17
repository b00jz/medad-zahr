// ==========================================================================
// Service Worker (Offline Mobile Caching) - مِدادُ زَهْر (Medad Zahr)
// ==========================================================================

const CACHE_NAME = 'medad-zahr-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/services/i18n.js',
  './js/services/moderationService.js',
  './js/services/initialData.js',
  './js/services/store.js',
  './js/services/pdfService.js',
  './js/services/authService.js',
  './js/services/dbService.js',
  './assets/logo.png',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(e.request).catch(() => caches.match('./index.html'));
    })
  );
});
