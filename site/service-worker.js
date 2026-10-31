/*
 * One-time cleanup worker for the legacy offline cache.
 * It replaces the prior PWA worker, clears all old caches, reloads open clients,
 * and unregisters itself so the static site is served directly thereafter.
 */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: "window", includeUncontrolled: true }))
      .then((clients) => Promise.all(clients.map((client) => client.navigate(client.url))))
      .then(() => self.registration.unregister())
  );
});
