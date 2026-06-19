import { useState, useEffect } from 'react'
import Header from './components/Header'
import MissionStats from './components/MissionStats'
import MissionForm from './components/MissionForm'
import MissionFilters from './components/MissionFilters'
import MissionCard from './components/MissionCard'
import EmptyState from './components/EmptyState'

export default function App() {
  // Helper to get today's date in YYYY-MM-DD format
  const getTodayString = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Pre-populated default missions for a premium first-time experience
  const getDefaultMissions = () => {
    const today = new Date()
    const todayStr = getTodayString(today)

    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const tomorrowStr = getTodayString(tomorrow)

    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const yesterdayStr = getTodayString(yesterday)

    return [
      {
        id: 'default-1',
        title: 'Configure ZenFlow mission board core telemetry',
        priority: 'high',
        dueDate: todayStr,
        completed: true,
        createdAt: Date.now() - 3600000 * 4
      },
      {
        id: 'default-2',
        title: 'Synchronize active focus sub-modules and dashboards',
        priority: 'medium',
        dueDate: tomorrowStr,
        completed: false,
        createdAt: Date.now() - 3600000 * 2
      },
      {
        id: 'default-3',
        title: 'Calibrate calm state ambient waves',
        priority: 'low',
        dueDate: yesterdayStr,
        completed: false,
        createdAt: Date.now() - 3600000
      }
    ]
  }

  // 1. Theme State (Default to dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('zenflow-theme') || 'dark'
  })

  // 2. Missions State
  const [missions, setMissions] = useState(() => {
    const saved = localStorage.getItem('zenflow-missions')
    return saved ? JSON.parse(saved) : getDefaultMissions()
  })

  // 3. UI Filters, Search, and Edit State
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [editingMission, setEditingMission] = useState(null)

  // Apply and persist theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('zenflow-theme', theme)
  }, [theme])

  // Persist missions
  useEffect(() => {
    localStorage.setItem('zenflow-missions', JSON.stringify(missions))
  }, [missions])

  // Core Actions
  const handleAddMission = (missionData) => {
    const newMission = {
      id: `mission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: missionData.title,
      priority: missionData.priority,
      dueDate: missionData.dueDate,
      completed: false,
      createdAt: Date.now()
    }
    setMissions(prev => [newMission, ...prev])
  }

  const handleToggleComplete = (id) => {
    setMissions(prev =>
      prev.map(m => (m.id === id ? { ...m, completed: !m.completed } : m))
    )
  }

  const handleEdit = (mission) => {
    setEditingMission(mission)
    // Scroll to form smoothly
    const formElement = document.querySelector('.mission-form-panel')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleUpdateMission = (updatedMission) => {
    setMissions(prev =>
      prev.map(m => (m.id === updatedMission.id ? updatedMission : m))
    )
    setEditingMission(null)
  }

  const handleDelete = (id) => {
    setMissions(prev => prev.filter(m => m.id !== id))
    if (editingMission && editingMission.id === id) {
      setEditingMission(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingMission(null)
  }

  // Derived Values
  const todayStr = getTodayString(new Date())
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = getTodayString(tomorrow)

  // Filter & Search Logic
  const filteredMissions = missions.filter(m => {
    // Search filter
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false

    // Category filter
    switch (activeFilter) {
      case 'active':
        return !m.completed
      case 'completed':
        return m.completed
      case 'critical':
        return m.priority === 'high' && !m.completed
      case 'overdue':
        return m.dueDate < todayStr && !m.completed
      case 'all':
      default:
        return true
    }
  })

  // "Today's Flow" urgent missions: Overdue, Today, or Tomorrow (and active/not completed)
  const urgentMissions = missions.filter(m =>
    !m.completed &&
    (m.dueDate <= tomorrowStr || m.dueDate < todayStr)
  ).sort((a, b) => {
    // Sort critical first, then by date
    if (a.priority === 'high' && b.priority !== 'high') return -1
    if (a.priority !== 'high' && b.priority === 'high') return 1
    return a.dueDate.localeCompare(b.dueDate)
  })

  return (
    <div className="app-container">
      {/* Premium Header */}
      <Header
        theme={theme}
        setTheme={setTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Focus Stats Panel */}
      <MissionStats missions={missions} />

      {/* Dashboard Main Grid Area */}
      <div className="dashboard-grid">
        {/* Left side: Mission Creator & Board Filters */}
        <div className="left-column">
          <MissionForm
            key={editingMission ? `edit-${editingMission.id}` : 'new'}
            onAddMission={handleAddMission}
            editingMission={editingMission}
            onUpdateMission={handleUpdateMission}
            onCancelEdit={handleCancelEdit}
          />

          <MissionFilters
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            missions={missions}
          />

          {/* Today's Flow Widget (stacked under filters on mobile / smaller viewports) */}
          <div className="todays-flow-panel glass-panel mobile-only">
            <div className="flow-header">
              <span className="flow-title">TODAY'S FLOW</span>
              <span className="flow-indicator-badge">{urgentMissions.length} URGENT</span>
            </div>
            <div className="flow-list">
              {urgentMissions.length > 0 ? (
                urgentMissions.slice(0, 3).map(m => (
                  <div key={m.id} className={`flow-item priority-${m.priority}`}>
                    <span className="flow-bullet"></span>
                    <span className="flow-item-text">{m.title}</span>
                  </div>
                ))
              ) : (
                <p className="flow-empty-text">No urgent missions detected. Current status: Stable.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right side / Main area: Mission Control Board */}
        <div className="right-column">
          <div className="board-header">
            <h2 className="board-title">ACTIVE OPERATION BOARD</h2>
            <span className="board-subtitle">Showing {filteredMissions.length} operational zones</span>
          </div>

          <div className="missions-board">
            {filteredMissions.length > 0 ? (
              <div className="mission-cards-grid">
                {filteredMissions.map(mission => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {/* Sidebar for Desktop: Today's Flow (shown alongside cards on desktop) */}
        <div className="desktop-sidebar-column">
          <div className="todays-flow-panel glass-panel desktop-only">
            <div className="flow-header">
              <span className="flow-title">TODAY'S FLOW</span>
              <span className="flow-indicator-badge">{urgentMissions.length} URGENT</span>
            </div>
            <div className="flow-list">
              {urgentMissions.length > 0 ? (
                urgentMissions.map(m => {
                  let dateLabel = "Upcoming"
                  if (m.dueDate === todayStr) dateLabel = "Today"
                  else if (m.dueDate === tomorrowStr) dateLabel = "Tomorrow"
                  else if (m.dueDate < todayStr) dateLabel = "OVERDUE"

                  return (
                    <div key={m.id} className={`flow-item priority-${m.priority}`}>
                      <div className="flow-item-top">
                        <span className="flow-item-badge">{dateLabel}</span>
                        <span className={`flow-prio-dot prio-dot-${m.priority}`}></span>
                      </div>
                      <span className="flow-item-text">{m.title}</span>
                    </div>
                  )
                })
              ) : (
                <div className="flow-empty-state">
                  <svg className="flow-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <p className="flow-empty-text">No urgent missions detected. Flow is perfectly optimized.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
