const CACHE = 'zombie-bastion-v1';
self.addEventListener('install', e=>{
    self.skipWaiting();
});
self.addEventListener('activate', e=>{
    e.waitUntil(
        caches.keys().then(keys=>Promise.all(
            keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
        ))
    );
});
self.addEventListener('fetch', e=>{
    e.respondWith(
        caches.match(e.request).then(cached=>{
            return cached || fetch(e.request).then(res=>{
                if(!res||res.status!==200) return res;
                let clone = res.clone();
                caches.open(CACHE).then(c=>c.put(e.request,clone));
                return res;
            });
        }).catch(()=>caches.match(e.request))
    );
});
