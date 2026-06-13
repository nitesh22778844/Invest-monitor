// Persistent cache for the parsed dataset so the app doesn't re-fetch from
// Google Drive on every load. We only go to Drive on first run (empty cache) or
// when the user clicks Refresh. Backed by localStorage so it survives reloads.
const KEY = 'invest-monitor:data:v1'

export function saveCache(dataset) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ cachedAt: Date.now(), dataset }))
  } catch {
    // Ignore quota / serialization errors — caching is best-effort.
  }
}

// Returns { dataset, cachedAt } or null. Transaction dates are revived from ISO.
export function loadCache() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const p = JSON.parse(raw)
    const ds = p.dataset || {}
    const reviveDate = (t) => ({ ...t, date: t.date ? new Date(t.date) : null })
    ds.transactions = (ds.transactions || []).map(reviveDate)
    ds.mfTransactions = (ds.mfTransactions || []).map(reviveDate)
    return { dataset: ds, cachedAt: p.cachedAt }
  } catch {
    return null
  }
}
