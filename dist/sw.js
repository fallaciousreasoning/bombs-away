const resources = [
    "/",
    "/main.js",
    "/styles.css",
    "/manifest.json"
];
const cacheName = "assets-v1";

addEventListener('install', e => {
    e.waitUntil(caches.open(cacheName).then(cache => {
        cache.addAll(resources);
    }).then(self.skipWaiting()));
});

const getResponse = async (event) => {
    // Try and fetch the resource from the network.
    // If that fails, serve what we have in the cache.
    try {
        return await fetch(event.request);
    } catch (err) {
        const response = await caches.match(event.request);
        return response;
    }
}

addEventListener('fetch', event => {
    event.respondWith(getResponse(event));
})