const CACHE_NAME = "alimenta-obra-v11";
const scopePath = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const withScope = (path) => `${scopePath}${path.startsWith("/") ? path : `/${path}`}` || "/";
const ASSETS = [
  withScope("/"),
  withScope("/index.html"),
  withScope("/assets/icone-alimentaobra.png"),
  withScope("/assets/logo-alimentaobra.png")
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.hostname.endsWith(".supabase.co")) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(withScope("/index.html"), copy));
          return response;
        })
        .catch(() => caches.match(withScope("/index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached ?? fetch(event.request).then((response) => {
      if (response.ok && url.origin === self.location.origin) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
