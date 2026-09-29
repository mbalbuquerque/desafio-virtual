const CACHE_NAME = 'corraporvoce-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/logopng.png',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:ital,wght@0,400;0,600;0,700;1,400&display=swap'
];
 
// Instalação — faz cache dos arquivos principais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});
 
// Ativação — limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
 
// Fetch — estratégia: rede primeiro, cache como fallback
self.addEventListener('fetch', event => {
  // Deixa requisições ao Supabase sempre ir para a rede (dados em tempo real)
  if (event.request.url.includes('supabase.co')) return;
 
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Atualiza o cache com a resposta mais recente
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});