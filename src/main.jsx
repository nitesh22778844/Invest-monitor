import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register the PWA service worker (prod only; dev runs without it). Each build
// ships a uniquely-versioned sw.js (see scripts/stamp-sw.mjs), so a new deploy is
// detected as an update — we then auto-reload the running app onto the new code
// instead of the user having to reinstall the PWA.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  // True only when a SW already controls this page — i.e. not the first install.
  const hadController = !!navigator.serviceWorker.controller
  let reloading = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading || !hadController) return
    reloading = true
    window.location.reload()
  })

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      reg.update?.()
      // Re-check for a newer SW each time the app is reopened/foregrounded
      // (mobile PWAs resume from background without a full reload).
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update?.()
      })
    }).catch(() => {})
  })
}
