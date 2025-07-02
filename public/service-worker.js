const CACHE_NAME = 'hassir-lastre-v1.0.0';
const OFFLINE_URL = '/';

// Assets críticos que se cachean inmediatamente
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/img/optimized-logo/logo-large.webp',
  '/img/optimized-profile/profile-large.webp',
  '/img/optimized-about/about-large.webp',
  '/img/optimized-contact/contact-large.webp',
  '/img/favicon-new.svg',
  '/img/favicon-new.png',
  '/img/favicon-new.ico'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  // Solo manejar requests HTTP/HTTPS
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Si está en cache, devolverlo
        if (cachedResponse) {
          return cachedResponse;
        }

        // Si no está en cache, hacer fetch
        return fetch(event.request)
          .then((response) => {
            // Verificar que la respuesta sea válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar respuesta para cachear
            const responseToCache = response.clone();

            // Cachear recursos útiles
            if (shouldCache(event.request)) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            // Si falla la red, intentar servir contenido offline
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // Para otros recursos, devolver respuesta offline básica
            return new Response('Offline content not available', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Función para determinar qué recursos cachear
function shouldCache(request) {
  const url = new URL(request.url);
  
  // Cachear imágenes, CSS, JS, fonts
  return (
    request.method === 'GET' &&
    (
      url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|css|js|woff|woff2|ttf|eot|ico)$/i) ||
      url.pathname === '/' ||
      url.pathname.includes('/img/')
    )
  );
}

// Escuchar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 