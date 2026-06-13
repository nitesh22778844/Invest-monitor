// Loading / error / empty placeholder states.

export function Loader({ label = 'Loading…' }) {
  return (
    <div className="state">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state state--error">
      <div className="state__icon">⚠️</div>
      <p>{message}</p>
      {onRetry && (
        <button className="btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, children }) {
  return (
    <div className="state">
      <div className="state__icon">📭</div>
      <h3>{title}</h3>
      {children}
    </div>
  )
}
