// 缓存版本号（每次修改 sw.js 后记得更新这个版本号）
const CACHE_NAME = 'mc-tools-v1';

// 需要缓存的资源列表
const urlsToCache = [
  '/',
  '/index.html',
  '/tools.json',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://unpkg.com/pinyin-pro@3.18.3/dist/index.js'
];

// 安装 Service Worker，缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开，开始缓存资源');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // 立即激活新版本
  );
});

// 激活时，清理旧版本缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存：', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // 立即控制所有页面
  );
});

// 拦截请求，使用 Stale-While-Revalidate 策略
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // 网络请求，用于更新缓存
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // 如果请求成功，更新缓存（只缓存同源或允许的跨域资源）
            if (networkResponse.ok && (event.request.url.startsWith(self.location.origin) || 
                event.request.url.includes('cdn.tailwindcss.com') ||
                event.request.url.includes('cdnjs.cloudflare.com') ||
                event.request.url.includes('cdn.jsdelivr.net') ||
                event.request.url.includes('unpkg.com'))) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // 网络请求失败，如果缓存存在则返回缓存，否则显示离线提示
            if (cachedResponse) {
              return cachedResponse;
            }
            // 如果连缓存都没有，返回一个简单响应
            return new Response('离线模式，部分功能不可用', { status: 503 });
          });

        // 如果有缓存，先返回缓存；同时发起网络请求更新缓存
        if (cachedResponse) {
          // 异步更新缓存，不阻塞响应
          event.waitUntil(fetchPromise.then(() => {}));
          return cachedResponse;
        } else {
          // 无缓存，直接等待网络结果
          return fetchPromise;
        }
      });
    })
  );
});