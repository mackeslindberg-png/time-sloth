/* time/sloth – Service Worker
   Safe update strategy (no stale cache)
*/

const CACHE_NAME = "time-sloth-v4"; // bumpa till v4, v5 vid större uppdateringar

self.addEventListener("install", event => {
  // Tvinga ny service worker att aktiveras direkt
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  // Rensa ALLA gamla cachar
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  // Ta kontroll över alla öppna sidor direkt
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  // Network-first: alltid försök hämta nytt
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
