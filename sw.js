/* C_TS452 runbook — offline service worker
   Network-first for pages so an updated deploy is picked up immediately,
   cache-first for static assets. Bump CACHE when you change the asset list. */

var CACHE = 'cts452-v2';
var ASSETS = [
  './',
  './index.html',
  './task3.html',
  './task4.html',
  './task5.html',
  './task6.html',
  './task7.html',
  './edge-cases.html',
  './deploy.html',
  './assets/app.css',
  './assets/app.js',
  './assets/icon.svg',
  './manifest.webmanifest'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // addAll fails the whole install if any single file 404s — add them individually
      return Promise.all(ASSETS.map(function (u) {
        return c.add(u).catch(function () { });
      }));
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;

  var isDoc = req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') > -1;

  if (isDoc) {
    // network-first: always prefer a fresh page, fall back to cache offline
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || caches.match('./index.html');
        });
      })
    );
    return;
  }

  // cache-first for css / js / icons
  e.respondWith(
    caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      });
    })
  );
});
