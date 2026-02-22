import { useEffect, useState } from 'react'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './App.css'

const localizer = momentLocalizer(moment)

function App() {
  const [events, setEvents] = useState([])
  const [chores, setChores] = useState([])
  const [newPerson, setNewPerson] = useState('')
  const [newChore, setNewChore] = useState('')

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(ev => ({
          ...ev,
          start: new Date(ev.start),
          end: new Date(ev.end),
        }))
        setEvents(mapped)
      })

    fetch('/api/chores')
      .then(res => res.json())
      .then(data => setChores(data))
  }, [])

  const PERSON_COLORS = {
  Care: '#e57373',
  Karl: '#64b5f6',
  Reid: '#81c784',
  Haylie: '#ba68c8',
}
const DEFAULT_COLOR = '#90a4ae'

const handleSelectSlot = async ({ start, end }) => {
  const title = window.prompt('Event title?')
  if (!title) return
  const person = window.prompt('Who is this for? (Karl, Care, Kid1, Kid2)')
  if (!person) return

  const body = {
    title,
    person,
    start: start.toISOString(),
    end: end.toISOString(),
    all_day: false,
  }

  const res = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) return

  const created = await res.json()
  setEvents(prev => [
    ...prev,
    {
      ...created,
      start: new Date(created.start),
      end: new Date(created.end),
    },
  ])
}

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-title">Home Calendar</div>
        <div className="app-date">{new Date().toLocaleString()}</div>
      </header>

      <div className="app-main">
        <div className="app-calendar">
          <Calendar
            selectable
            localizer={localizer}
            events={events}
            defaultView={Views.MONTH}
            startAccessor="start"
            endAccessor="end"
            views={['month', 'week', 'day']}
            onSelectSlot={handleSelectSlot}
            eventPropGetter={event => {
              const color = PERSON_COLORS[event.person] || DEFAULT_COLOR
              return {
                style: {
                  backgroundColor: color,
                  borderRadius: '4px',
                  border: 'none',
                },
              }
            }}
          />
        </div>

                <aside className="app-sidebar">
          <h2>Chores</h2>
          <form
            onSubmit={async e => {
              e.preventDefault()
              if (!newPerson || !newChore) return
              const res = await fetch('/api/chores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ person: newPerson, text: newChore }),
              })
              if (!res.ok) return
              const created = await res.json()
              setChores(prev => [...prev, created])
              setNewChore('')
            }}
          >
            <div>
              <input
                placeholder="Person"
                value={newPerson}
                onChange={e => setNewPerson(e.target.value)}
              />
            </div>
            <div>
              <input
                placeholder="Chore"
                value={newChore}
                onChange={e => setNewChore(e.target.value)}
              />
            </div>
            <button type="submit">Add</button>
          </form>

          <ul>
            {chores.map(c => (
              <li key={c.id}>
                <label style={{ opacity: c.done ? 0.5 : 1 }}>
                  <input
                    type="checkbox"
                    checked={c.done}
                    onChange={async () => {
                      const res = await fetch(`/api/chores/${c.id}/toggle`, {
                        method: 'POST',
                      })
                      if (!res.ok) return
                      const updated = await res.json()
                      setChores(prev =>
                        prev.map(ch => (ch.id === updated.id ? updated : ch)),
                      )
                    }}
                  />
                  <strong>{c.person}</strong>: {c.text}
                </label>
              </li>
            ))}
          </ul>

        </aside>

      </div>
    </div>
  )
}

export default App
