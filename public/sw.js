const CACHE = 'veejay-foods-demo-v7';
const ASSETS = [
  './','./index.html','./app.js','./style.css','./safe-area.css','./complaints.css','./audit-fixes.css','./pwa.css','./manifest.webmanifest','./assets/veejay-logo.png',
  './assets/food/banga.jpeg','./assets/food/chicken.jpg','./assets/food/edikaikong.jpeg',
  './assets/food/efo.jpeg','./assets/food/egusi.jpg','./assets/food/fried-rice.jpg',
  './assets/food/jollof.jpeg','./assets/food/meal-deal.jpg','./assets/food/meat-pie.jpeg',
  './assets/food/mixed-okra.jpeg','./assets/food/moi-moi.jpg','./assets/food/ofada-rice.jpeg',
  './assets/food/ogbono.jpg','./assets/food/puff-puff.jpeg','./assets/food/yam-porridge.jpeg','./assets/food/zobo.jpg',
  './assets/food/owo.webp','./assets/food/ukodo.webp'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => event.request.mode === 'navigate' ? caches.match('./index.html') : Response.error())));
});
