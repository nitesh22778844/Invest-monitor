// Slim top bar: brand on the left, the tab nav inline (passed as children), and
// a 3-dots menu on the right holding the data-source badge + Refresh — so the
// top strip isn't wasted on a big header.
import { useState } from 'react'
import { formatDateTime } from '../lib/format.js'

export default function AppBar({ source, lastUpdated, onRefresh, busy, children }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="appbar">
      <div className="appbar__brand">
        <span className="appbar__logo">◆</span>
        <h1>Invest Monitor</h1>
      </div>

      {children}

      <div className="appbar__menu">
        <button
          className="kebab"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          ⋮
        </button>
        {menuOpen && (
          <>
            <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
            <div className="menu" role="menu">
              {onRefresh && (
                <button
                  className="menu__item"
                  disabled={busy}
                  onClick={() => {
                    setMenuOpen(false)
                    onRefresh()
                  }}
                >
                  {busy ? 'Refreshing…' : '↻ Refresh data'}
                </button>
              )}
              <div className="menu__info">
                {source && <span className={`source-badge source-badge--${source.kind}`}>{source.label}</span>}
                {lastUpdated && <span className="muted">Updated {formatDateTime(lastUpdated)}</span>}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
