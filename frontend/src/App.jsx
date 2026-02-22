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
      .catch(err => console.error('Error loading events', err))
  }, [])

  return (
    <div style={{ height: '100vh', padding: '1rem' }}>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView={Views.MONTH}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day']}
      />
    </div>
  )
}

export default App
