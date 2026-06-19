
export default function MissionStats({ missions }) {
  // Calculations for Stats
  const totalMissions = missions.length
  const completedMissions = missions.filter(m => m.completed).length
  const activeMissions = totalMissions - completedMissions
  const criticalMissions = missions.filter(m => m.priority === 'high' && !m.completed).length

  // Focus Score Algorithm: weighted by priority
  // Low (Calm) = 1, Medium (Focus) = 2, High (Critical) = 3
  const getWeight = (priority) => {
    switch (priority) {
      case 'high': return 3
      case 'medium': return 2
      case 'low':
      default: return 1
    }
  }

  const totalPoints = missions.reduce((acc, curr) => acc + getWeight(curr.priority), 0)
  const completedPoints = missions.reduce((acc, curr) => acc + (curr.completed ? getWeight(curr.priority) : 0), 0)
  
  const focusScore = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 100

  // Focus Score feedback text
  let statusMessage = "Calm Flow"
  let statusColor = "var(--priority-low)"
  if (focusScore === 100) {
    statusMessage = "Zen Master"
    statusColor = "var(--status-completed)"
  } else if (focusScore >= 75) {
    statusMessage = "Peak Focus"
    statusColor = "var(--status-completed)"
  } else if (focusScore >= 40) {
    statusMessage = "Active Flow"
    statusColor = "var(--priority-medium)"
  } else if (focusScore > 0) {
    statusMessage = "System Alert"
    statusColor = "var(--priority-high)"
  }

  return (
    <div className="stats-container">
      {/* Focus HUD Panel */}
      <div className="hud-panel glass-panel">
        <div className="hud-header">
          <span className="hud-title">FOCUS SYSTEM</span>
          <span className="hud-indicator" style={{ color: statusColor, textShadow: `0 0 10px ${statusColor}` }}>
            {statusMessage}
          </span>
        </div>
        
        <div className="hud-content">
          <div className="hud-circle-wrapper">
            <svg className="hud-circle-svg" viewBox="0 0 100 100" width="100" height="100">
              <circle className="hud-circle-bg" cx="50" cy="50" r="40" />
              <circle
                className="hud-circle-progress"
                cx="50"
                cy="50"
                r="40"
                style={{
                  strokeDasharray: 251.2,
                  strokeDashoffset: 251.2 - (251.2 * focusScore) / 100,
                  stroke: statusColor,
                  filter: `drop-shadow(0 0 6px ${statusColor})`
                }}
              />
            </svg>
            <div className="hud-score-value">
              <span className="hud-score-number">{focusScore}</span>
              <span className="hud-score-pct">%</span>
            </div>
          </div>
          
          <div className="hud-details">
            <div className="hud-detail-row">
              <span className="hud-detail-label">Sync Status</span>
              <span className="hud-detail-val active">ONLINE</span>
            </div>
            <div className="hud-detail-row">
              <span className="hud-detail-label">Power Weight</span>
              <span className="hud-detail-val">{completedPoints} / {totalPoints} LP</span>
            </div>
            <div className="hud-detail-row">
              <span className="hud-detail-label">Zen Ratio</span>
              <span className="hud-detail-val">{totalMissions ? Math.round((completedMissions / totalMissions) * 100) : 100}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 4 numeric indicators */}
      <div className="stats-grid">
        <div className="stat-card glass-panel" style={{ '--card-accent': 'var(--accent)' }}>
          <div className="stat-glow"></div>
          <span className="stat-label">TOTAL MISSIONS</span>
          <span className="stat-value">{totalMissions}</span>
          <div className="stat-bar" style={{ width: '100%', background: 'var(--accent)' }}></div>
        </div>

        <div className="stat-card glass-panel" style={{ '--card-accent': 'var(--priority-medium)' }}>
          <div className="stat-glow"></div>
          <span className="stat-label">ACTIVE MISSIONS</span>
          <span className="stat-value">{activeMissions}</span>
          <div className="stat-bar" style={{ width: totalMissions ? `${(activeMissions / totalMissions) * 100}%` : '0%', background: 'var(--priority-medium)' }}></div>
        </div>

        <div className="stat-card glass-panel" style={{ '--card-accent': 'var(--status-completed)' }}>
          <div className="stat-glow"></div>
          <span className="stat-label">COMPLETED</span>
          <span className="stat-value">{completedMissions}</span>
          <div className="stat-bar" style={{ width: totalMissions ? `${(completedMissions / totalMissions) * 100}%` : '0%', background: 'var(--status-completed)' }}></div>
        </div>

        <div className="stat-card glass-panel" style={{ '--card-accent': 'var(--priority-high)' }}>
          <div className="stat-glow"></div>
          <span className="stat-label">CRITICAL THREATS</span>
          <span className="stat-value">{criticalMissions}</span>
          <div className="stat-bar" style={{ width: totalMissions ? `${(criticalMissions / totalMissions) * 100}%` : '0%', background: 'var(--priority-high)' }}></div>
        </div>
      </div>
    </div>
  )
}
