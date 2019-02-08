self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('myFvCache').then(function(cache) {
            return cache.addAll([
                '/theList/',
                '/theList/index.html',
                '/theList/css/main.css',
                '/theList/helper.js',
            ]);
        })
    );
});
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
    );
});
/*self.addEventListener('activate', function(event) {
    var cacheWhitelist = [myFvCache];
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});*/