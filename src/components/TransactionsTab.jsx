// Transaction log + reconciliation panel.
import { useMemo, useState } from 'react'
import HoldingsTable from './HoldingsTable.jsx'
import ReconcilePanel from './ReconcilePanel.jsx'
import { EmptyState } from './StateViews.jsx'
import { formatINR, formatNumber, formatDate } from '../lib/format.js'

export default function TransactionsTab({ holdings, transactions }) {
  const [side, setSide] = useState('ALL')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (side !== 'ALL' && t.side !== side) return false
      if (query && !`${t.name} ${t.symbol}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [transactions, side, query])

  const columns = [
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date), sortValue: (r) => r.date?.getTime() || 0 },
    { key: 'name', label: 'Scrip', render: (r) => <span className="cell-name">{r.name}</span> },
    { key: 'symbol', label: 'Symbol', render: (r) => <span className="mono muted">{r.symbol || '—'}</span> },
    {
      key: 'side',
      label: 'Type',
      render: (r) => <span className={`badge badge--${r.side === 'BUY' ? 'ok' : 'warn'}`}>{r.side}</span>,
    },
    { key: 'qty', label: 'Qty', align: 'right', render: (r) => formatNumber(r.qty) },
    { key: 'price', label: 'Price', align: 'right', render: (r) => formatINR(r.price, { paise: true }) },
    {
      key: 'value',
      label: 'Value',
      align: 'right',
      render: (r) => formatINR((r.qty || 0) * (r.price || 0)),
      sortValue: (r) => (r.qty || 0) * (r.price || 0),
    },
  ]

  return (
    <div className="tab">
      <ReconcilePanel holdings={holdings} transactions={transactions} />

      <div className="toolbar">
        <div className="segmented">
          {['ALL', 'BUY', 'SELL'].map((s) => (
            <button key={s} className={side === s ? 'active' : ''} onClick={() => setSide(s)}>
              {s === 'ALL' ? 'All' : s}
            </button>
          ))}
        </div>
        <input
          className="search"
          placeholder="Search scrip or symbol…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="muted">{filtered.length} transactions</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No transactions match">Try clearing the filters.</EmptyState>
      ) : (
        <HoldingsTable columns={columns} rows={filtered} initialSort={{ key: 'date', dir: 'desc' }} />
      )}
    </div>
  )
}
