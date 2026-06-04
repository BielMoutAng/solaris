const STATIC_CACHE = "solaris-biblioteca-static-20260604b";
const RUNTIME_CACHE = "solaris-biblioteca-runtime-20260604b";

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=20260604h",
  "./official-items.js?v=20260603b",
  "./HumanisVitalHUD.js?v=20260603d",
  "./app.js?v=20260604h",
  "./manifest.webmanifest",
  "./assets/icons/solaris-icon.svg",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/solaris-icon-192.png",
  "./assets/icons/solaris-icon-512.png",
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
