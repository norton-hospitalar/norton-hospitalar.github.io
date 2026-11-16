/* Service worker: funciona offline nas visitas. Altere VERSION a cada publicação. */
const VERSION = 'norton-v4';
const SHELL = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "data.js",
  "content.js",
  "manifest.webmanifest",
  "img/logo-norton.png",
  "img/favicon.png",
  "img/icon-192.png",
  "img/thumb/canulados-razek.jpg",
  "img/thumb/ccs2.jpg",
  "img/thumb/collect.jpg",
  "img/thumb/ct-surgery.jpg",
  "img/thumb/ctk.jpg",
  "img/thumb/endoscopia.jpg",
  "img/thumb/fastfit.jpg",
  "img/thumb/fenix-sp2.jpg",
  "img/thumb/fenix.jpg",
  "img/thumb/filler.jpg",
  "img/thumb/fix-falange.jpg",
  "img/thumb/fix-ombro.jpg",
  "img/thumb/fixnail.jpg",
  "img/thumb/flush.jpg",
  "img/thumb/ft-surgery.jpg",
  "img/thumb/genesis.jpg",
  "img/thumb/hallufix.jpg",
  "img/thumb/hipsystem.jpg",
  "img/thumb/liberty.jpg",
  "img/thumb/microdissectoras.jpg",
  "img/thumb/neo-hip.jpg",
  "img/thumb/orion.jpg",
  "img/thumb/orthoblock.jpg",
  "img/thumb/perc-pe.jpg",
  "img/thumb/perossal.jpg",
  "img/thumb/prime.jpg",
  "img/thumb/quartz.jpg",
  "img/thumb/r-disc.jpg",
  "img/thumb/r-discectomy.jpg",
  "img/thumb/r-evolution.jpg",
  "img/thumb/r-feet.jpg",
  "img/thumb/r-iconic.jpg",
  "img/thumb/r-perform.jpg",
  "img/thumb/r-stim.jpg",
  "img/thumb/regcell.jpg",
  "img/thumb/secure.jpg",
  "img/thumb/selaz-circular.jpg",
  "img/thumb/snap-off.jpg",
  "img/thumb/target-hand.jpg",
  "img/thumb/target-spine.jpg",
  "img/thumb/targets.jpg",
  "img/thumb/toride-canulado.jpg",
  "img/thumb/toride-clavicula.jpg",
  "img/thumb/toride-dupla-rosca.jpg",
  "img/thumb/toride-grandes.jpg",
  "img/thumb/toride-mao.jpg",
  "img/thumb/toride-mini-fragmentos.jpg",
  "img/thumb/toride-mini-micro.jpg",
  "img/thumb/toride-pe-av.jpg",
  "img/thumb/toride-pequenos.jpg",
  "img/thumb/toride-radio-distal.jpg",
  "img/thumb/uni-biopsy.jpg",
  "img/thumb/zimmer.jpg"
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const isCode = /\.(html|js|css|webmanifest)$/.test(new URL(req.url).pathname) || req.mode === 'navigate';
  if (isCode) {
    // rede primeiro (conteúdo atualizado), cache como reserva
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
  } else {
    // imagens: cache primeiro
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      const c = res.clone(); caches.open(VERSION).then(x => x.put(req, c)); return res; })));
  }
});
