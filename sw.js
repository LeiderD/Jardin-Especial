const CACHE_NAME = 'jardin-especial-v1';
const urlsToCache = [
    './',
    './index.html',
    './css/styles-advanced.css',
    './css/components.css',
    './js/config.js',
    './js/effects.js',
    './js/flower.js',
    './js/garden.js',
    './js/utils.js',
    './js/music-and-letters.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache opened');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    // Solo cachear peticiones HTTP/HTTPS, ignorar chrome-extension: y otros esquemas
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    response => {
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});