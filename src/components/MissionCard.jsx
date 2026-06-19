export default function MissionCard({ mission, onToggleComplete, onEdit, onDelete }) {
  const getTodayString = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const parts = dateStr.split('-')
    if (parts.length !== 3) return dateStr
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const day = parseInt(parts[2], 10)
    const dateObj = new Date(year, month, day)
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getDeadlineBadge = (dateStr, completed) => {
    const today = new Date()
    const todayStr = getTodayString(today)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const tomorrowStr = getTodayString(tomorrow)

    if (dateStr === todayStr) {
      return { text: 'Today', className: 'deadline-today' }
    } else if (dateStr === tomorrowStr) {
      return { text: 'Tomorrow', className: 'deadline-tomorrow' }
    } else if (dateStr < todayStr) {
      return { text: completed ? 'Done' : 'Overdue', className: completed ? 'deadline-completed' : 'deadline-overdue' }
    } else {
      return { text: 'Upcoming', className: 'deadline-upcoming' }
    }
  }

  const getPriorityLabel = (prio) => {
    switch (prio) {
      case 'high': return 'CRITICAL'
      case 'medium': return 'FOCUS'
      case 'low':
      default: return 'CALM'
    }
  }

  const deadline = getDeadlineBadge(mission.dueDate, mission.completed)
  const priorityLabel = getPriorityLabel(mission.priority)

  return (
    <div className={`mission-card glass-panel priority-${mission.priority} ${mission.completed ? 'completed' : ''}`}>
      <div className="card-top">
        {/* Priority Badge */}
        <span className={`priority-badge priority-badge-${mission.priority}`}>
          <span className="prio-indicator"></span>
          {priorityLabel}
        </span>
        
        {/* Deadline Badge */}
        <span className={`deadline-badge ${deadline.className}`}>
          {deadline.text}
        </span>
      </div>

      <div className="card-body">
        {/* Completion checkbox checkmark */}
        <button
          type="button"
          className={`checkbox-glow-btn ${mission.completed ? 'checked' : ''}`}
          onClick={() => onToggleComplete(mission.id)}
          aria-label={mission.completed ? "Mark mission as active" : "Complete mission"}
        >
          <div className="checkbox-inner">
            {mission.completed && (
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
        </button>

        {/* Title */}
        <div className="mission-title-container">
          <p className="mission-title-text" title={mission.title}>
            {mission.title}
          </p>
          <span className="mission-date-label">{formatDate(mission.dueDate)}</span>
        </div>
      </div>

      <div className="card-actions">
        <button
          type="button"
          className="card-action-btn edit"
          onClick={() => onEdit(mission)}
          aria-label="Edit mission parameters"
          title="Edit Mission"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button
          type="button"
          className="card-action-btn delete"
          onClick={() => onDelete(mission.id)}
          aria-label="Decommission mission"
          title="Delete Mission"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  )
}
