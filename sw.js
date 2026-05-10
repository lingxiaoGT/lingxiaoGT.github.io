const CACHE_NAME = 'mc-tools-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/launchericon-192x192.png',
  '/launchericon-512x512.png',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/js/data.js',
  '/assets/js/i18n.js',
  '/assets/js/render.js',
  '/assets/data/tools.json',
  '/assets/data/tag-mapping.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://unpkg.com/pinyin-pro@3.18.3/dist/index.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(name => name !== CACHE_NAME && caches.delete(name))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse.ok && (event.request.url.startsWith(self.location.origin) ||
              event.request.url.includes('cdn.tailwindcss.com') ||
              event.request.url.includes('cdnjs.cloudflare.com') ||
              event.request.url.includes('cdn.jsdelivr.net') ||
              event.request.url.includes('unpkg.com'))) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cached || new Response('离线模式，部分功能不可用', { status: 503 }));
        return cached ? fetchPromise : fetchPromise;
      })
    )
  );
});