const resources = [
    "/",
    "/main.js",
    "/styles.css",
    "/manifest.json",
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
        const response = await fetch(event.request);

        // Store the new response in the cache, so we don't serve
        // stale data.
        const cache = await caches.open(cacheName);
        await cache.put(event.request, response.clone());

        return  response;
    } catch (err) {
        const response = await caches.match(event.request);
        return response;
    }
}

addEventListener('fetch', event => {
    event.respondWith(getResponse(event));
})