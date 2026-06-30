const STATIC_CACHE = "solaris-biblioteca-static-20260629a";
const RUNTIME_CACHE = "solaris-biblioteca-runtime-20260629a";

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=20260629a",
  "./official-books-data.js?v=20260629a",
  "./official-book5-catalog.js?v=20260629a",
  "./official-rulebook-compendium.js?v=20260629a",
  "./HumanisVitalHUD.js?v=20260606e",
  "./app.js?v=20260629a",
  "./src/domain/solaris-domain-architecture.js?v=20260629a",
  "./src/domain/solaris-character-creation.js?v=20260629a",
  "./src/domain/solaris-combat-rules.js?v=20260629a",
  "./src/domain/solaris-equipment-rules.js?v=20260629a",
  "./src/domain/solaris-bestiary-rules.js?v=20260629a",
  "./src/domain/solaris-gm-rules.js?v=20260629a",
  "./src/domain/solaris-lore-rules.js?v=20260629a",
  "./src/session/solaris-session-domain.js?v=20260629a",
  "./src/session/solaris-session-client.js?v=20260629a",
  "./src/session/solaris-session-ui.js?v=20260629a",
  "./src/session/solaris-session-persistence.js?v=20260629a",
  "./manifest.webmanifest",
  "./assets/icons/solaris-icon.svg",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/solaris-icon-192.png",
  "./assets/icons/solaris-icon-512.png",
  "./assets/maps/nave-caida.png",
  "./assets/bestiary/book3-cover.jpg",
  "./assets/vendor/three/build/three.module.js",
  "./assets/vendor/three/examples/jsm/loaders/GLTFLoader.js",
  "./assets/vendor/three/examples/jsm/utils/BufferGeometryUtils.js",
  "./assets/vendor/three/examples/jsm/utils/SkeletonUtils.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET" || !request.url.startsWith(self.location.origin)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const copy = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
