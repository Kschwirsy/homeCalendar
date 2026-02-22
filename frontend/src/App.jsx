import { useEffect, useState } from 'react'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

function App() {
  const [events, setEvents] = useState([])

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
  }, [])

  const handleSelectSlot = async ({ start, end }) => {
    const title = window.prompt('Event title?')
    if (!title) return

    const body = {
      title,
      start: start.toISOString(),
      end: end.toISOString(),
      all_day: false,
    }

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      console.error('Error creating event')
      return
    }

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
    <div style={{ height: '100vh', padding: '1rem' }}>
      <Calendar
        selectable
        localizer={localizer}
        events={events}
        defaultView={Views.MONTH}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day']}
        onSelectSlot={handleSelectSlot}
      />
    </div>
  )
}

export default App
