
export default function EmptyState() {
  return (
    <div className="empty-state-panel glass-panel">
      <div className="radar-container">
        <div className="radar-glow"></div>
        <div className="radar-circle pulse-1"></div>
        <div className="radar-circle pulse-2"></div>
        <div className="radar-circle pulse-3"></div>
        <svg className="radar-icon" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
          <line x1="12" y1="2" x2="12" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
        </svg>
      </div>
      <h3 className="empty-title">SCAN COMPLETE</h3>
      <p className="empty-desc">Your mission board is clear. Add your next focus mission.</p>
    </div>
  )
}
