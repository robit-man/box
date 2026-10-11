/* Cross-origin isolation helper based on coi-serviceworker v0.1.6 by Guido Zuidhof (MIT).
 * This script is installed only at the site's own origin. It modifies same-origin
 * navigation responses to enable SharedArrayBuffer. Original source:
 * https://github.com/gzuidhof/coi-serviceworker
 */
if (typeof window === 'undefined') {
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
  self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.cache === 'only-if-cached' && req.mode !== 'same-origin') return;
    event.respondWith(fetch(req).then(response => {
      if (!response || response.type === 'opaque' || response.status === 0) return response;
      const headers = new Headers(response.headers);
      headers.set('Cross-Origin-Opener-Policy', 'same-origin');
      headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
      return new Response(response.body, {status:response.status,statusText:response.statusText,headers});
    }));
  });
}
