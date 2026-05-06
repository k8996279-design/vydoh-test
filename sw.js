const CACHE_PREFIX = 'vydoh-shell';
const CACHE_NAME = `${CACHE_PREFIX}-v16`;
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/pwa.js',
  './js/app/sounds.js',
  './js/app/storage.js',
  './js/app/state.js',
  './js/app/cover.js',
  './js/app/navigation.js',
  './js/app/cards.js',
  './js/app/mood.js',
  './js/app/home.js',
  './js/app/interactions.js',
  './js/app/program.js',
  './js/app/init.js',
  './js/data/library.js',
  './js/data/program.js',
  './assets/app/icon-180.png',
  './assets/app/icon-192.png',
  './assets/app/icon-512.png'
];
const APP_SHELL_PATHS = new Set(
  APP_SHELL.map((path) => new URL(path, self.location.origin).pathname)
);

function putInCache(request, response) {
  if (!response || response.status !== 200) return response;
  const copy = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
  return response;
}

async function networkFirst(request, fallback) {
  try {
    const response = await fetch(request, { cache: 'no-store' });
    return putInCache(request, response);
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (fallback) return caches.match(fallback);
    throw error;
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  return putInCache(request, response);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isSound = isSameOrigin && url.pathname.includes('/assets/sounds/');
  const isAppShellAsset = isSameOrigin && APP_SHELL_PATHS.has(url.pathname);
  const isNavigation = request.mode === 'navigate';

  if (isNavigation) {
    event.respondWith(networkFirst(request, './index.html'));
    return;
  }

  if (isAppShellAsset) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isSound) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (!isSameOrigin) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});
