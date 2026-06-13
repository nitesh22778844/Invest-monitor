// Formatting helpers (INR, numbers, percentages, dates).

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const inrPaise = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

const num = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 })

export function formatINR(value, { paise = false } = {}) {
  if (value == null || Number.isNaN(value)) return '—'
  return paise ? inrPaise.format(value) : inr.format(value)
}

export function formatNumber(value) {
  if (value == null || Number.isNaN(value)) return '—'
  return num.format(value)
}

export function formatPct(value) {
  if (value == null || Number.isNaN(value)) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

// Compact INR for KPI cards (e.g. ₹25.6L, ₹1.2Cr).
export function formatINRCompact(value) {
  if (value == null || Number.isNaN(value)) return '—'
  const abs = Math.abs(value)
  if (abs >= 1e7) return `₹${(value / 1e7).toFixed(2)}Cr`
  if (abs >= 1e5) return `₹${(value / 1e5).toFixed(2)}L`
  if (abs >= 1e3) return `₹${(value / 1e3).toFixed(1)}K`
  return inr.format(value)
}

export function formatDate(value) {
  if (!value) return '—'
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(value) {
  if (!value) return '—'
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
