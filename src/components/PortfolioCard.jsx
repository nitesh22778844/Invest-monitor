// Portfolio card: Invested (headline) + Current + P&L (amount & %).
import { formatINR, formatPct } from '../lib/format.js'

export default function PortfolioCard({ title, color, stats, featured = false }) {
  const { invested, current, pnl, pnlPct, anyCurrent, fullyPriced, count } = stats
  const pos = pnl != null && pnl >= 0

  return (
    <div className={`card pcard ${featured ? 'pcard--featured' : ''}`} style={{ '--accent-c': color }}>
      <div className="pcard__head">
        <span className="pcard__title">
          <span className="pcard__dot" style={{ background: color }} />
          {title}
        </span>
        {count != null && <span className="pcard__count">{count}</span>}
      </div>

      <div className="pcard__invested">
        <span className="pcard__label">Invested</span>
        <span className="pcard__value">{formatINR(invested)}</span>
      </div>

      <div className="pcard__rows">
        <div className="pcard__row">
          <span className="pcard__label">Current</span>
          <span className="pcard__amt">{anyCurrent ? formatINR(current) : '—'}</span>
        </div>
        <div className="pcard__row">
          <span className="pcard__label">P&amp;L</span>
          <span className={`pcard__amt ${pnl == null ? '' : pos ? 'pos' : 'neg'}`}>
            {pnl == null ? (
              '—'
            ) : (
              <>
                {formatINR(pnl)} <span className="pcard__pct">{pos ? '▲' : '▼'} {formatPct(pnlPct)}</span>
              </>
            )}
          </span>
        </div>
      </div>

      {!anyCurrent && <p className="pcard__note">Current price not in INDmoney export</p>}
      {anyCurrent && !fullyPriced && <p className="pcard__note">Unpriced holdings valued at cost</p>}
    </div>
  )
}
