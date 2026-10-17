import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

async function getPublicImageRevisions(publicDir, currentDir = publicDir) {
  const entries = await readdir(currentDir, { withFileTypes: true })
  const revisions = {}

  for (const entry of entries) {
    const filePath = path.join(currentDir, entry.name)
    if (entry.isDirectory()) {
      Object.assign(revisions, await getPublicImageRevisions(publicDir, filePath))
      continue
    }

    if (!/\.(png|jpe?g|svg|webp|avif)$/i.test(entry.name)) continue

    const contents = await readFile(filePath)
    const relativePath = path.relative(publicDir, filePath).split(path.sep).join('/')
    revisions[`/${relativePath}`] = createHash('sha256').update(contents).digest('hex')
  }

  return revisions
}

function staticImageCachePlugin() {
  let publicDir

  return {
    name: 'static-image-cache',
    configResolved(config) {
      publicDir = config.publicDir
    },
    async generateBundle() {
      const revisions = await getPublicImageRevisions(publicDir)
      const serviceWorker = `
const CACHE_NAME = 'emoji-charades-images-v1';
const ASSET_REVISIONS = ${JSON.stringify(revisions)};

function cacheKey(path) {
  const url = new URL(path, self.location.origin);
  url.search = '';
  url.searchParams.set('__asset_revision', ASSET_REVISIONS[path]);
  return new Request(url.href);
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const request of await cache.keys()) {
      const url = new URL(request.url);
      const revision = url.searchParams.get('__asset_revision');
      if (ASSET_REVISIONS[url.pathname] !== revision) {
        await cache.delete(request);
      }
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  const revision = ASSET_REVISIONS[url.pathname];
  if (request.method !== 'GET' || url.origin !== self.location.origin || !revision) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const key = cacheKey(url.pathname);
    const cached = await cache.match(key);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
      await cache.put(key, response.clone());
    }
    return response;
  })());
});
`

      this.emitFile({
        type: 'asset',
        fileName: 'service-worker.js',
        source: serviceWorker
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), staticImageCachePlugin()],
})
