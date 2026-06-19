import { useState } from 'react'

const getTodayString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function MissionForm({ onAddMission, editingMission, onUpdateMission, onCancelEdit }) {
  const [title, setTitle] = useState(editingMission ? editingMission.title : '')
  const [priority, setPriority] = useState(editingMission ? editingMission.priority : 'medium')
  const [dueDate, setDueDate] = useState(editingMission ? (editingMission.dueDate || '') : getTodayString())

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const missionData = {
      title: title.trim(),
      priority,
      dueDate: dueDate || getTodayString()
    }

    if (editingMission) {
      onUpdateMission({
        ...editingMission,
        ...missionData
      })
    } else {
      onAddMission(missionData)
      setTitle('')
      setPriority('medium')
      setDueDate(getTodayString())
    }
  }

  return (
    <form className="mission-form-panel glass-panel" onSubmit={handleSubmit}>
      <h2 className="form-title">
        <span className="form-title-glow"></span>
        {editingMission ? 'UPDATE MISSION PARAMETERS' : 'INITIATE FOCUS MISSION'}
      </h2>

      <div className="form-grid">
        {/* Mission Input */}
        <div className="form-group full-width">
          <label htmlFor="mission-title" className="form-label">MISSION DESIGNATION</label>
          <input
            id="mission-title"
            type="text"
            className="form-input text-input"
            placeholder="Describe the objective..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        {/* Priority Level Select */}
        <div className="form-group">
          <label className="form-label">PRIORITY PROFILE</label>
          <div className="priority-selector">
            <label className={`priority-pill low ${priority === 'low' ? 'active' : ''}`}>
              <input
                type="radio"
                name="priority"
                value="low"
                checked={priority === 'low'}
                onChange={() => setPriority('low')}
                className="hidden-radio"
              />
              <span className="priority-dot"></span>
              CALM
            </label>

            <label className={`priority-pill medium ${priority === 'medium' ? 'active' : ''}`}>
              <input
                type="radio"
                name="priority"
                value="medium"
                checked={priority === 'medium'}
                onChange={() => setPriority('medium')}
                className="hidden-radio"
              />
              <span className="priority-dot"></span>
              FOCUS
            </label>

            <label className={`priority-pill high ${priority === 'high' ? 'active' : ''}`}>
              <input
                type="radio"
                name="priority"
                value="high"
                checked={priority === 'high'}
                onChange={() => setPriority('high')}
                className="hidden-radio"
              />
              <span className="priority-dot"></span>
              CRITICAL
            </label>
          </div>
        </div>

        {/* Due Date Picker */}
        <div className="form-group">
          <label htmlFor="mission-date" className="form-label">TARGET DEADLINE</label>
          <input
            id="mission-date"
            type="date"
            className="form-input date-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-actions">
        {editingMission && (
          <button
            type="button"
            className="form-btn cancel-btn"
            onClick={onCancelEdit}
          >
            ABORT EDIT
          </button>
        )}
        <button type="submit" className="form-btn submit-btn">
          {editingMission ? 'ENGAGE UPDATE' : 'DEPLOY MISSION'}
        </button>
      </div>
    </form>
  )
}
