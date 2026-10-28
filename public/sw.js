const CACHE = 'veejay-foods-demo-v13';
const ASSETS = [
  './','./index.html','./app.js','./style.css','./safe-area.css','./complaints.css','./audit-fixes.css','./premium-header.css','./meal-builder.css','./pwa.css','./palm-wine-theme.css','./manifest.webmanifest','./assets/veejay-logo.png',
  './assets/food/banga.jpeg','./assets/food/chicken.jpg','./assets/food/edikaikong.jpeg',
  './assets/food/efo.jpeg','./assets/food/egusi.jpg','./assets/food/fried-rice.jpg',
  './assets/food/jollof.jpeg','./assets/food/meat-pie.jpeg',
  './assets/food/mixed-okra.jpeg','./assets/food/moi-moi.jpg','./assets/food/ofada-rice.jpeg',
  './assets/food/ogbono.jpg','./assets/food/puff-puff.jpeg','./assets/food/yam-porridge.jpeg','./assets/food/zobo.jpg',
  './assets/food/owo.webp','./assets/food/ukodo.webp',
  './assets/food/chapman.webp','./assets/food/tigernut.webp','./assets/food/pineapple-ginger.webp','./assets/food/minerals.webp','./assets/food/malt.webp',
  './assets/food/pounded-yam.webp','./assets/food/eba.webp','./assets/food/semo.webp','./assets/food/fufu.webp','./assets/food/starch.webp',
  './assets/food/beef.webp','./assets/food/goat.webp','./assets/food/turkey.webp','./assets/food/catfish.webp','./assets/food/croaker.webp','./assets/food/assorted.webp','./assets/food/stockfish.webp',
  './assets/food/egusi-soup.webp','./assets/food/banga-soup.webp','./assets/food/owo-soup.webp'
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
