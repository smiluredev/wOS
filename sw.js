const CACHE_NAME = 'v1_meu_webapp_cache';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/images/logo.png',
  '/offline.html' // Página opcional para quando não houver internet
];

// 1. Instalação: Salva os arquivos essenciais no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Arquivos em cache!');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Ativação: Limpa caches antigos se houver mudança de versão
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Interceptação de buscas (Fetch): Responde com cache ou busca na rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Se encontrar no cache, retorna. Se não, busca na rede.
      return response || fetch(event.request);
    }).catch(() => {
      // Se falhar (offline e sem cache), mostra a página offline
      return caches.match('/offline.html');
    })
  );
});
