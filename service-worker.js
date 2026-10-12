/* Yu-Gi-Oh! Deck Probability — app shell offline */
const CACHE_NAME='yugioh-deck-probability-v1';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./icons/favicon-64.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME && k.startsWith('yugioh-deck-probability-')).map(k=>caches.delete(k)))),
  self.clients.claim()
 ]));
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET' || new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cached=await caches.match(event.request,{ignoreSearch:true});
  if(cached)return cached;
  try{
   const network=await fetch(event.request);
   if(network.ok){const cache=await caches.open(CACHE_NAME);cache.put(event.request,network.clone());}
   return network;
  }catch(error){
   if(event.request.mode==='navigate'){
    const fallback=await caches.match('./index.html');if(fallback)return fallback;
   }
   throw error;
  }
 })());
});
