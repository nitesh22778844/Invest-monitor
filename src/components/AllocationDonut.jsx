// Lightweight SVG donut chart + legend. No chart library.
import { formatINR } from '../lib/format.js'

export default function AllocationDonut({
  segments,
  title,
  action,
  centerValue,
  centerLabel = 'classes',
  size = 180,
  bare = false,
  legendMax,
}) {
  const total = segments.reduce((a, s) => a + s.value, 0)
  const stroke = Math.max(16, Math.round(size * 0.14))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r

  // Precompute each arc's length and starting offset (no mutation during render).
  const lens = segments.map((s) => (total ? (s.value / total) * c : 0))
  const arcs = segments.map((s, i) => ({
    ...s,
    len: lens[i],
    offset: lens.slice(0, i).reduce((a, b) => a + b, 0),
  }))

  const body = (
    <>
      {(title || action) && (
        <div className="donut-head">
          {title && <h3 className="card__title" style={{ marginBottom: 0 }}>{title}</h3>}
          {action}
        </div>
      )}
      <div className="donut">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut__svg">
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ring-track)" strokeWidth={stroke} />
            {arcs.map((s) => (
              <circle
                key={s.key || s.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeDasharray={`${s.len} ${c - s.len}`}
                strokeDashoffset={-s.offset}
              />
            ))}
          </g>
          <text x="50%" y="46%" className="donut__total" textAnchor="middle">
            {centerValue ?? segments.length}
          </text>
          <text x="50%" y="58%" className="donut__total-label" textAnchor="middle">
            {centerLabel}
          </text>
        </svg>
        <ul
          className="legend"
          style={legendMax ? { maxHeight: legendMax, overflowY: 'auto', paddingRight: 6 } : undefined}
        >
          {segments.map((s) => (
            <li key={s.key || s.label} className="legend__item">
              <span className="legend__dot" style={{ background: s.color }} />
              <span className="legend__label" title={s.full || s.label}>
                {s.label}
              </span>
              <span className="legend__pct">{s.pct.toFixed(1)}%</span>
              <span className="legend__val">{formatINR(s.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )

  return bare ? body : <div className="card donut-card">{body}</div>
}
