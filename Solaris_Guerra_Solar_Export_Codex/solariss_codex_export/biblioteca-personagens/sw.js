const STATIC_CACHE = "solaris-biblioteca-static-20260630e";
const RUNTIME_CACHE = "solaris-biblioteca-runtime-20260630e";

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=20260630e",
  "./official-books-data.js?v=20260630e",
  "./official-book5-catalog.js?v=20260630e",
  "./official-rulebook-compendium.js?v=20260630e",
  "./HumanisVitalHUD.js?v=20260606e",
  "./app.js?v=20260630e",
  "./src/domain/solaris-domain-architecture.js?v=20260630e",
  "./src/domain/solaris-character-creation.js?v=20260630e",
  "./src/domain/solaris-combat-rules.js?v=20260630e",
  "./src/domain/solaris-equipment-rules.js?v=20260630e",
  "./src/domain/solaris-bestiary-rules.js?v=20260630e",
  "./src/domain/solaris-gm-rules.js?v=20260630e",
  "./src/domain/solaris-lore-rules.js?v=20260630e",
  "./src/schemas/solaris-schemas.js",
  "./src/schemas/solaris-character.schema.js",
  "./src/schemas/solaris-item.schema.js",
  "./src/schemas/solaris-creature.schema.js",
  "./src/schemas/solaris-campaign.schema.js",
  "./src/schemas/solaris-export.schema.js",
  "./src/export/solaris-export-core.js",
  "./src/export/solaris-import-core.js",
  "./src/export/solaris-foundry-export.js",
  "./manifest.webmanifest",
  "./assets/icons/solaris-icon.svg",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/solaris-icon-192.png",
  "./assets/icons/solaris-icon-512.png",
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
