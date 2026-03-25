/* sw.js — offline cache for BT/Relâche PWA */
const CACHE_NAME = "bt-relache-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Only handle GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Same-origin only
  if (url.origin !== self.location.origin) return;

  // Cache-first for navigations and same-origin assets
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // For navigations, try cache first, then network, fallback to cached index
      if (req.mode === "navigate") {
        const cached = await cache.match("./index.html");
        try {
          const fresh = await fetch(req);
          cache.put(req, fresh.clone()).catch(()=>{});
          return fresh;
        } catch (e) {
          return cached || Response.error();
        }
      }

      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;

      try {
        const fresh = await fetch(req);
        // cache new static assets opportunistically
        cache.put(req, fresh.clone()).catch(()=>{});
        return fresh;
      } catch (e) {
        return hit || Response.error();
      }
    })()
  );
});
