import { useEffect, useState } from 'react'
import { useDesktopStore } from '../../store/useDesktopStore'
import { useWindowSize } from '../../hooks/useWindowSize'

const ACTIVITIES = [
  'Entrenar para competencias como ICPC o TAP',
  'Participar en proyectos open-source',
  'Aprender desde cero o mejorar tu nivel técnico',
  'Dar talleres y llevar programación a escuelas',
]


export default function WelcomeApp() {
  const openWindow = useDesktopStore((s) => s.openWindow)
  const { isMobile } = useWindowSize()
  const [displayCount, setDisplayCount] = useState(0)
  const [resolved, setResolved] = useState(false)

  useEffect(() => {
    fetch('/api/inscripciones-count')
      .then((res) => res.json())
      .then((data) => {
        const total: number = data.total ?? 0
        setResolved(true)

        // Count up animation: easeOutQuad over ~800ms
        const duration = 800
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - (1 - t) * (1 - t)
          setDisplayCount(Math.round(eased * total))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="h-full overflow-auto px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
      <div className="mx-auto max-w-4xl">
        {/* Meta */}
        <p className={`mb-2 font-mono tracking-wider text-muted ${isMobile ? 'text-[0.65rem]' : 'text-xs sm:text-sm'}`} style={{ animation: 'slide-in 200ms ease-out both', animationDelay: '50ms' }}>
          // Bariloche - Argentina · <span className="text-accent">2026</span>
        </p>

        {/* Header with counter */}
        <div className="mb-3 flex flex-col items-start justify-between gap-3 sm:mb-4 sm:gap-4 md:mb-5 md:flex-row md:items-start" style={{ animation: 'slide-in 200ms ease-out both', animationDelay: '100ms' }}>
          <div>
            {/* Heading */}
            <h1 className={`font-mono font-bold leading-tight text-text ${isMobile ? 'text-base' : 'text-lg sm:text-xl md:text-2xl'}`} style={{ animation: 'slide-in 200ms ease-out both', animationDelay: '120ms' }}>
              Club de
              <br />
              Programaci&oacute;n
            </h1>
            <div className={`font-mono font-bold leading-tight text-text ${isMobile ? 'text-base' : 'text-lg sm:text-xl md:text-2xl'}`} style={{ animation: 'slide-in 200ms ease-out both', animationDelay: '150ms' }}>
              ret<span className="text-accent">UNRN</span>
            </div>
          </div>

          {/* Member counter */}
          <div
            className={`flex items-center gap-2 rounded border transition-all duration-700 ${resolved ? 'border-green/30 bg-green/5' : 'border-yellow-500/30 bg-yellow-500/5'} ${isMobile ? 'px-3 py-2' : 'px-4 py-3'}`}
            style={{ animation: 'slide-in 200ms ease-out both', animationDelay: '200ms' }}
          >
            {/* dot */}
            <div
              className={`h-2 w-2 rounded-full shrink-0 transition-colors duration-700 ${resolved ? 'bg-green' : 'bg-yellow-400'}`}
              style={resolved ? undefined : { animation: 'pulse 800ms ease-in-out infinite' }}
            />

            {!resolved ? (
              <span className={`font-mono text-yellow-400 ${isMobile ? 'text-[0.7rem]' : 'text-xs sm:text-sm'}`}>
                obteniendo info...
              </span>
            ) : (
              <div
                className={`font-mono text-text ${isMobile ? 'text-[0.7rem]' : 'text-xs sm:text-sm'}`}
                style={{ animation: 'slide-up 300ms ease-out both' }}
              >
                <span className="text-green tabular-nums" style={{ animation: 'count-pop 500ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
                  {displayCount}
                </span>
                <span className="text-muted"> miembros</span>
              </div>
            )}
          </div>
        </div>

        {/* Prompt */}
        <p className={`mb-3 font-mono text-green sm:mb-5 ${isMobile ? 'text-[0.7rem]' : 'text-xs sm:text-sm'}`} style={{ animation: 'slide-in 200ms ease-out both', animationDelay: '220ms' }}>
          &gt;&gt;&gt;{' '}
          <span className="text-text">
            Un espacio abierto, colaborativo y orientado a la práctica donde la programación se aprende haciendo.
          </span>
        </p>

        {/* Activities + Actions layout */}
        <div className={`mt-3 grid gap-4 sm:mt-4 sm:gap-5 md:mt-5 md:gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`} style={{ animation: 'slide-in 200ms ease-out both', animationDelay: '280ms' }}>
          {/* Activities */}
          <div>
            <h2 className={`mb-2 font-mono font-bold text-accent sm:mb-3 ${isMobile ? 'text-[0.7rem]' : 'text-xs sm:text-sm'}`}>¿Qué podés hacer en el club?</h2>
            <ul className={isMobile ? 'space-y-1.5' : 'space-y-2'}>
              {ACTIVITIES.map((activity, idx) => (
                <li key={idx} className={`flex gap-2 font-mono text-text ${isMobile ? 'text-[0.7rem]' : 'text-xs sm:text-sm'}`}>
                  <span className="mt-0.5 shrink-0 text-green">→</span>
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className={`flex flex-col gap-2 sm:gap-3 ${isMobile ? '' : 'md:justify-center'}`}>
            <button
              onClick={() => openWindow('about')}
              className={`w-full rounded border border-border px-3 py-2 font-mono text-text transition-colors hover:border-muted hover:bg-surface-2 sm:px-5 sm:py-3 ${isMobile ? 'text-[0.7rem]' : 'text-xs sm:text-sm'}`}
            >
              Conoc&eacute; el club
            </button>
            <button
              onClick={() => openWindow('form')}
              className={`w-full rounded bg-accent px-3 py-2 font-mono text-white transition-colors hover:bg-accent-h sm:px-5 sm:py-3 ${isMobile ? 'text-[0.7rem]' : 'text-xs sm:text-sm'}`}
            >
              Quiero ser parte
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
