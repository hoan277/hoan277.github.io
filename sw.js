const CACHE_NAME = "v1_cache_panel_adm";
const urlsToCache = ["./manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        urlsToCache.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("Không cache được:", url, err);
          })
        )
      ).then(() => self.skipWaiting())
    )
  );
});

self.addEventListener("activate", (e) => {
  const whitelist = [CACHE_NAME];
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (!whitelist.includes(key)) return caches.delete(key);
        })
      )
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
