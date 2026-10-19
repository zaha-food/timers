/* Zaha Timers — service worker.
   Caches the whole app so the till iPad opens and runs with no wifi.
   Bump CACHE whenever any file changes, or the iPad keeps the old copy. */

const CACHE = 'timers-v26';
const FILES = [
  './',
  './index.html',
  './logo.svg',
  './icon-180.png',
  './icon-512.png',
  './manifest.webmanifest',
  './img/01.jpg',
  './img/010.jpg',
  './img/011.jpg',
  './img/012.jpg',
  './img/013.jpg',
  './img/015.jpg',
  './img/017.jpg',
  './img/018.jpg',
  './img/02.jpg',
  './img/020.jpg',
  './img/021.jpg',
  './img/samosas.jpg',
  './img/022.jpg',
  './img/023.jpg',
  './img/024.jpg',
  './img/025.jpg',
  './img/026.jpg',
  './img/027.jpg',
  './img/029.jpg',
  './img/03.jpg',
  './img/04.jpg',
  './img/06.jpg',
  './img/07.jpg',
  './img/08.jpg',
  './img/broccoli.jpg',
  './img/greek-yoghurt.jpg',
  './img/herb.jpg',
];

self.addEventListener('install', e => {
  // cache: 'reload' skips the browser's own cache, so a new version never installs old files.
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first so updates arrive when online; cache when offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })   // always ask the server, never a stale browser copy
      .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
