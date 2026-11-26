// Only cache the public guest shell. Apartment data is saved separately per resident.
const shell=new URL('./',self.registration.scope).href;
const cacheName='little-lives-guest-shell-v1';
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(cacheName);await cache.add(new Request(shell,{cache:'reload'}));await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  if(event.request.mode!=='navigate'||new URL(event.request.url).pathname!==new URL(shell).pathname)return;
  event.respondWith((async()=>{const cache=await caches.open(cacheName);
    try{const response=await fetch(event.request);if(response.ok)await cache.put(shell,response.clone());return response;}
    catch{const saved=await cache.match(shell);if(saved)return saved;throw Error('Guest shell unavailable');}
  })());
});
