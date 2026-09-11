/*
 *   FILE: "sw.js"
 *   AUTHOR: $Creator.0\tg <tgreen.dev@outlook.com>
 *   SUMMARY: FelisOS Kernel Service Worker for offline PWA functionality.
 */

const CACHE_NAME = 'felisos-kernel-v26.9.9-assets';

// Core OS assets required for the offline desktop shell
const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './css/tokens.css',
    './css/components.css',
    './css/variables.css',
    './css/core.css',
    './css/shelf.css',
    './js/kernel.js',
    './js/vfs.js',
    './js/window-manager.js',
    './assets/ui/icons/icon-192x192.svg',
    './assets/ui/icons/icon-512x512.svg',
    './assets/ui/icons/felis-start.svg',
    './assets/ui/icons/icon-explorer.svg',
    './assets/ui/icons/icon-scribe.svg',
    './assets/ui/icons/icon-terminal.svg',
    './assets/ui/wallpapers/default-bg.svg'
];

// 1. Install Event: Cache the core workspace and system scripts
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[FelisOS Kernel] Caching core environment assets...');
            return cache.addAll(CORE_ASSETS);
        })
    );
    self.skipWaiting();
});

// 2. Activate Event: Clean up legacy caches to prevent version conflicts
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[FelisOS Kernel] Purging legacy cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. Fetch Event: Cache-First strategy for zero-backend operation
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return cached asset if available, otherwise attempt network fetch
            if (cachedResponse) return cachedResponse;
            return fetch(event.request).then((response) => {
                if (response.ok && event.request.method === 'GET') {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                }
                return response;
            }).catch(() => event.request.mode === 'navigate'
                ? caches.match('./index.html')
                : new Response('', { status: 504, statusText: 'Offline' }));
        })
    );
});