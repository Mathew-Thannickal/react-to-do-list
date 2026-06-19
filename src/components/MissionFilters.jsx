
export default function MissionFilters({ activeFilter, setActiveFilter, missions }) {
  const getTodayString = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const todayStr = getTodayString()

  // Count matches
  const counts = {
    all: missions.length,
    active: missions.filter(m => !m.completed).length,
    completed: missions.filter(m => m.completed).length,
    critical: missions.filter(m => m.priority === 'high' && !m.completed).length,
    overdue: missions.filter(m => m.dueDate < todayStr && !m.completed).length
  }

  const filterOptions = [
    { id: 'all', label: 'All Missions', count: counts.all, color: 'var(--accent)' },
    { id: 'active', label: 'Active', count: counts.active, color: 'var(--priority-medium)' },
    { id: 'completed', label: 'Completed', count: counts.completed, color: 'var(--status-completed)' },
    { id: 'critical', label: 'Critical', count: counts.critical, color: 'var(--priority-high)' },
    { id: 'overdue', label: 'Overdue', count: counts.overdue, color: 'var(--status-overdue)' }
  ]

  return (
    <div className="filters-panel glass-panel">
      <span className="filters-header-label">BOARD FILTER:</span>
      <div className="filters-row">
        {filterOptions.map(option => (
          <button
            key={option.id}
            type="button"
            className={`filter-pill ${activeFilter === option.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(option.id)}
            style={{
              '--pill-accent': option.color
            }}
          >
            <span className="pill-text">{option.label}</span>
            <span className="pill-badge">{option.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
