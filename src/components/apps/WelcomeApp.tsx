import { useEffect, useState } from 'react'
import { useDesktopStore } from '../../store/useDesktopStore'
import { useWindowSize } from '../../hooks/useWindowSize'

const ACTIVITIES = [
  'Entrenar para competencias como ICPC o TAP',
  'Participar en proyectos open-source',
  'Aprender desde cero o mejorar tu nivel técnico',
  'Dar talleres y llevar programación a escuelas',
]

const ACTIVE_MEMBERS = 40

export default function WelcomeApp() {
  const openWindow = useDesktopStore((s) => s.openWindow)
  const { isMobile } = useWindowSize()
  const [mounted, setMounted] = useState(false)
  const [memberCount, setMemberCount] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Animate member counter
  useEffect(() => {
    if (!mounted) return
    let current = 0
    const interval = setInterval(() => {
      current += Math.ceil(ACTIVE_MEMBERS / 20)
      if (current >= ACTIVE_MEMBERS) {
        setMemberCount(ACTIVE_MEMBERS)
        clearInterval(interval)
      } else {
        setMemberCount(current)
      }
    }, 40)
    return () => clearInterval(interval)
  }, [mounted])

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
            className={`flex items-center gap-2 rounded border border-green/30 bg-green/5 ${isMobile ? 'px-3 py-2' : 'px-4 py-3'}`}
            style={{ animation: 'slide-in 200ms ease-out both', animationDelay: '200ms' }}
          >
            <div className="h-2 w-2 rounded-full bg-green shrink-0" />
            <div className={`font-mono text-text ${isMobile ? 'text-[0.7rem]' : 'text-xs sm:text-sm'}`}>
              <span className="text-green">{memberCount}</span>
              <span className="text-muted"> miembros activos</span>
            </div>
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
