// Reconciliation: do my transactions match my current holdings?
import { reconcile } from '../lib/reconcile.js'
import { formatNumber } from '../lib/format.js'
import { sourceRowClassName, sourceRowStyle } from '../lib/sourceStyle.js'

const STATUS = {
  match: { label: 'Exact match', cls: 'ok', icon: '✅' },
  reflected: { label: 'Reflected', cls: 'ok', icon: '✅' },
  shortfall: { label: 'Check', cls: 'warn', icon: '⚠️' },
  'pre-period': { label: 'Pre-period', cls: 'muted-badge', icon: '🕓' },
  closed: { label: 'Closed', cls: 'muted-badge', icon: '➖' },
}

export default function ReconcilePanel({ holdings, transactions }) {
  const { rows, summary } = reconcile(holdings, transactions)

  return (
    <div className="card reconcile">
      <div className="reconcile__head">
        <div>
          <h3 className="card__title">Reconciliation</h3>
          <p className="muted">
            Net transacted quantity vs current holding, per scrip. “Reflected” means your trades show
            up in the holding (a larger holding just means earlier buys); “check” means the holding is
            short of what you traded this period; “pre-period” means it was bought before this year&apos;s
            transaction window.
          </p>
        </div>
        <div className="pills">
          {summary.shortfall ? <span className="pill pill--warn">⚠️ {summary.shortfall} to check</span> : null}
          {summary.match || summary.reflected ? (
            <span className="pill pill--ok">✅ {(summary.match || 0) + (summary.reflected || 0)} reflected</span>
          ) : null}
          {summary['pre-period'] ? <span className="pill">🕓 {summary['pre-period']} pre-period</span> : null}
          {summary.closed ? <span className="pill">➖ {summary.closed} closed</span> : null}
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Scrip</th>
              <th className="ta-r">Net txn qty</th>
              <th className="ta-r">Holding qty</th>
              <th className="ta-r">Diff</th>
              <th>Status</th>
              <th className="ta-r">Buys</th>
              <th className="ta-r">Sells</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const st = STATUS[r.status]
              return (
                <tr key={r.key} className={sourceRowClassName(r)} style={sourceRowStyle(r)}>
                  <td className="cell-name">{r.name || r.isin}</td>
                  <td className="ta-r">{r.txnCount ? formatNumber(r.netTxn) : '—'}</td>
                  <td className="ta-r">{r.holdingQty != null ? formatNumber(r.holdingQty) : '—'}</td>
                  <td className={`ta-r ${r.status === 'shortfall' ? 'neg' : ''}`}>
                    {r.diff != null ? formatNumber(r.diff) : '—'}
                  </td>
                  <td>
                    <span className={`badge badge--${st.cls}`}>
                      {st.icon} {st.label}
                    </span>
                  </td>
                  <td className="ta-r">{r.buyQty ? formatNumber(r.buyQty) : '—'}</td>
                  <td className="ta-r">{r.sellQty ? formatNumber(r.sellQty) : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
