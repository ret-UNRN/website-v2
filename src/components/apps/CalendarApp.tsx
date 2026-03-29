import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Clock, ExternalLink } from 'lucide-react'

// Los eventos se leen desde https://github.com/ret-unrn/data/blob/main/events.json
// Para agregar o editar eventos, modificar ese archivo directamente en GitHub.
const EVENTS_URL = 'https://raw.githubusercontent.com/ret-UNRN/data/main/events.json'

interface CalendarEvent {
  date: string   // formato YYYY-MM-DD
  title: string
  time?: string  // opcional, ej: "18:00"
  url?: string   // opcional, link a más info
}

type FetchStatus = 'loading' | 'ok' | 'error'

const DAYS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

const MONTHS_SHORT = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOffset(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return (day + 6) % 7
}

function toKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatEventDate(dateKey: string) {
  const [, m, d] = dateKey.split('-')
  return `${parseInt(d)} ${MONTHS_SHORT[parseInt(m) - 1]}`
}

export default function CalendarApp() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState<string | null>(null)
  const [dir, setDir] = useState<'left' | 'right'>('right')
  const [eventDir, setEventDir] = useState<'left' | 'right'>('right')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [status, setStatus] = useState<FetchStatus>('loading')

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    fetch(EVENTS_URL)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: CalendarEvent[]) => {
        if (!cancelled) {
          setEvents(data)
          setStatus('ok')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => { cancelled = true }
  }, [])

  const daysInMonth = getDaysInMonth(year, month)
  const offset = getFirstDayOffset(year, month)

  const eventsByDate = events.reduce<Record<string, CalendarEvent[]>>((acc, e) => {
    acc[e.date] = [...(acc[e.date] ?? []), e]
    return acc
  }, {})

  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate())

  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`
  const eventsThisMonth = events.filter(e => e.date.startsWith(monthKey)).length

  const upcoming = events
    .filter(e => e.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date))

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  const goToToday = () => {
    const newYear = today.getFullYear()
    const newMonth = today.getMonth()
    const d = `${newYear}-${String(newMonth + 1).padStart(2, '0')}`
    const currentD = `${year}-${String(month + 1).padStart(2, '0')}`
    setDir(d > currentD ? 'right' : 'left')
    setYear(newYear)
    setMonth(newMonth)
    setSelected(todayKey)
  }

  const goToEvent = (dateKey: string) => {
    const [y, m] = dateKey.split('-').map(Number)
    const newYear = y
    const newMonth = m - 1
    const currentMonthNum = year * 12 + month
    const targetMonthNum = newYear * 12 + newMonth
    setDir(targetMonthNum >= currentMonthNum ? 'right' : 'left')
    setYear(newYear)
    setMonth(newMonth)
    setEventDir(selected && dateKey > selected ? 'right' : 'left')
    setSelected(dateKey)
  }

  const prevMonth = () => {
    setDir('left')
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelected(null)
  }

  const nextMonth = () => {
    setDir('right')
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelected(null)
  }

  const selectedEvents = selected ? (eventsByDate[selected] ?? []) : []

  const cells = Array.from({ length: 42 }, (_, i) => {
    const day = i - offset + 1
    if (day < 1 || day > daysInMonth) return null
    return day
  })

  return (
    <div className="flex h-full overflow-hidden">

      {/* Left — calendar */}
      <div className="flex flex-1 flex-col gap-3 overflow-auto px-5 py-5">
        <div className="mx-auto w-full max-w-sm flex flex-col gap-3">

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between">
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => { setDir('left'); setYear(y => y - 1); setSelected(null) }}
                className="flex h-7 w-7 touch-manipulation items-center justify-center rounded text-muted transition-colors hover:text-text"
                title="Año anterior"
              >
                <ChevronsLeft size={14} />
              </button>
              <button
                onClick={prevMonth}
                className="flex h-7 w-7 touch-manipulation items-center justify-center rounded text-muted transition-colors hover:text-text"
                title="Mes anterior"
              >
                <ChevronLeft size={14} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-0.5">
              <span
                key={`${year}-${month}`}
                className="font-mono text-sm font-semibold text-text"
                style={{ animation: `${dir === 'right' ? 'slide-in-right' : 'slide-in'} 180ms ease-out both` }}
              >
                {MONTHS[month]} <span className="text-accent">{year}</span>
              </span>
              <div className="flex items-center gap-2">
                {status === 'loading' && (
                  <span className="font-mono text-[0.65rem] text-muted animate-pulse">cargando...</span>
                )}
                {status === 'error' && (
                  <span className="font-mono text-[0.65rem] text-red-500">sin conexión</span>
                )}
                {status === 'ok' && eventsThisMonth > 0 && (
                  <span className="font-mono text-[0.65rem] text-muted">
                    {eventsThisMonth} evento{eventsThisMonth !== 1 ? 's' : ''}
                  </span>
                )}
                {!isCurrentMonth && (
                  <button
                    onClick={goToToday}
                    className="font-mono text-[0.65rem] text-accent hover:underline"
                  >
                    hoy
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                onClick={nextMonth}
                className="flex h-7 w-7 touch-manipulation items-center justify-center rounded text-muted transition-colors hover:text-text"
                title="Mes siguiente"
              >
                <ChevronRight size={14} />
              </button>
              <button
                onClick={() => { setDir('right'); setYear(y => y + 1); setSelected(null) }}
                className="flex h-7 w-7 touch-manipulation items-center justify-center rounded text-muted transition-colors hover:text-text"
                title="Año siguiente"
              >
                <ChevronsRight size={14} />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid shrink-0 grid-cols-7">
            {DAYS.map((d, i) => (
              <div
                key={d}
                className={`text-center font-mono text-xs ${i >= 5 ? 'text-muted/50' : 'text-muted'}`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div
            key={`${year}-${month}`}
            className="grid grid-cols-7 gap-1"
            style={{ animation: `${dir === 'right' ? 'slide-in-right' : 'slide-in'} 180ms ease-out both` }}
          >
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />
              const key = toKey(year, month, day)
              const hasEvent = !!eventsByDate[key]
              const isToday = key === todayKey
              const isSelected = key === selected
              const isWeekend = (i % 7) >= 5

              return (
                <button
                  key={key}
                  onClick={() => {
                    if (!isSelected) {
                      setEventDir(selected && key > selected ? 'right' : 'left')
                      setSelected(key)
                    } else {
                      setSelected(null)
                    }
                  }}
                  className={`aspect-square flex touch-manipulation flex-col items-center justify-center rounded-lg font-mono text-sm transition-colors
                    ${isSelected
                      ? 'bg-accent text-white'
                      : isToday
                        ? 'border border-accent bg-accent/10 font-semibold text-accent'
                        : isWeekend
                          ? 'text-text/40 hover:bg-surface-2'
                          : 'text-text/70 hover:bg-surface-2'
                    }`}
                >
                  {day}
                  {hasEvent && (
                    <span
                      className={`mt-0.5 h-1.5 w-1.5 rounded-full ring-1
                        ${isSelected ? 'bg-white ring-white/30' : 'bg-accent ring-accent/30'}`}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Panel de eventos del día seleccionado */}
          <div className="shrink-0 min-h-[4.5rem]">
            {selected && (
              <div
                key={selected}
                className="rounded-lg border border-border bg-surface-2 px-4 py-3"
                style={{ animation: `${eventDir === 'right' ? 'slide-in-right' : 'slide-in'} 200ms ease-out both` }}
              >
                {selectedEvents.length === 0 ? (
                  <p className="font-mono text-xs text-muted">sin eventos este día</p>
                ) : (
                  <div className="space-y-2">
                    {selectedEvents.map((e, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {e.time && (
                          <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-accent">
                            <Clock size={10} />
                            {e.time}
                          </span>
                        )}
                        <span className="flex-1 font-mono text-xs text-text">{e.title}</span>
                        {e.url && (
                          <a
                            href={e.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 rounded border border-border px-2 py-0.5 font-mono text-[0.7rem] text-muted transition-colors hover:border-accent hover:text-accent"
                          >
                            + info
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Right — upcoming events */}
      <div className="hidden sm:flex w-64 shrink-0 flex-col gap-4 border-l border-border px-4 py-5 overflow-auto">
        <p className="font-mono text-xs text-accent shrink-0"># próximos eventos</p>
        {status === 'loading' && (
          <p className="font-mono text-xs text-muted animate-pulse">cargando eventos...</p>
        )}
        {status === 'error' && (
          <p className="font-mono text-xs text-red-500">error al cargar eventos</p>
        )}
        {status === 'ok' && upcoming.length === 0 && (
          <p className="font-mono text-xs text-muted">sin eventos próximos</p>
        )}
        {status === 'ok' && upcoming.length > 0 && (
          <div className="flex flex-col gap-3">
            {upcoming.map((e, i) => (
              <button
                key={i}
                onClick={() => goToEvent(e.date)}
                className={`flex flex-col gap-1 text-left transition-opacity hover:opacity-100 ${selected === e.date ? 'opacity-100' : 'opacity-60'}`}
                style={{ animation: 'slide-in 200ms ease-out both', animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.7rem] text-accent">{formatEventDate(e.date)}</span>
                  {e.time && (
                    <span className="flex items-center gap-1 font-mono text-[0.7rem] text-muted">
                      <Clock size={9} />
                      {e.time}
                    </span>
                  )}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-mono text-xs leading-snug text-text/80">{e.title}</p>
                  {e.url && (
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={ev => ev.stopPropagation()}
                      className="shrink-0 text-muted transition-colors hover:text-accent"
                    >
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
                {i < upcoming.length - 1 && <div className="mt-1 border-b border-border" />}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
