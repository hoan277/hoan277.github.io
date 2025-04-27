const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/', // Trang chủ (nếu bạn muốn offline-ready)
  '/img/logo-ct.png',
  '/css/bootstrap-dark.min.css',
  '/css/dark-theme-core.css',
  '/css/forms.css',
  '/css/site.css',
  '/css/soft-ui-dashboard.min.css',
  '/css/widgets.css',
  '/js/site.js'
];

// Install SW và cache tài nguyên cần thiết
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate SW: xóa cache cũ nếu cần
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Fetch dữ liệu: ưu tiên lấy cache trước, rồi mới ra mạng
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Nếu là file CDN, bỏ qua => không cache
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
