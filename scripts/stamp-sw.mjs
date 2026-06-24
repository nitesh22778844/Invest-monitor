// Stamp a unique build id into the built service worker so every deploy ships a
// distinct sw.js. The browser only re-runs a SW's install/activate (which drops
// the old cache) when sw.js changes byte-for-byte; our SW is otherwise static, so
// without this stamp clients keep the old cached bundle until a manual reinstall.
//
// Runs after `vite build` (see package.json "build"). Operates on dist/, never the
// source public/sw.js — the literal __BUILD_VERSION__ placeholder stays in source.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const SW = 'dist/sw.js'
if (!existsSync(SW)) {
  console.error(`stamp-sw: ${SW} not found — run "vite build" first`)
  process.exit(1)
}

// A per-build timestamp (not the git hash) — guarantees a unique sw.js for every
// deploy, including redeploys of uncommitted changes, which is exactly the case
// where the old PWA otherwise stays stale.
const version = Date.now().toString(36)

const out = readFileSync(SW, 'utf8').replaceAll('__BUILD_VERSION__', version)
writeFileSync(SW, out)
console.log(`stamp-sw: cache version → invest-monitor-${version}`)
