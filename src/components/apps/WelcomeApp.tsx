import { useEffect, useState } from 'react'
import { useDesktopStore } from '../../store/useDesktopStore'

const STATS = [
  { label: 'actividad', value: '82%', width: 82 },
  { label: 'proyectos', value: '6 repos', width: 60 },
  { label: 'miembros', value: '6 activos', width: 100 },
]

export default function WelcomeApp() {
  const openWindow = useDesktopStore((s) => s.openWindow)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="h-full overflow-auto px-6 py-6">
      <div className="mx-auto max-w-2xl">
        {/* Meta */}
        <p className="mb-5 font-mono text-sm tracking-wider text-muted">
          // unrn sede andina &middot; bariloche &middot; patagonia &middot;{' '}
          <span className="text-accent">2026</span>
        </p>

        {/* Heading */}
        <h1 className="font-mono text-3xl font-bold leading-tight text-text">
          Club de
          <br />
          Programaci&oacute;n
        </h1>
        <div className="font-mono text-3xl font-bold leading-tight text-accent">
          retUNRN
        </div>

        {/* Prompt */}
        <p className="mt-5 mb-7 font-mono text-base text-green">
          &gt;&gt;&gt;{' '}
          <span className="text-text">
            aprender, competir y construir software con impacto social
          </span>
        </p>

        {/* Stats */}
        <div className="flex flex-col gap-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 font-mono text-sm"
            >
              <span className="w-[85px] shrink-0 text-muted">
                {stat.label}
              </span>
              <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-sm bg-surface-2">
                <div
                  className="h-full rounded-sm bg-accent transition-[width] duration-1000 ease-out"
                  style={{
                    width: mounted ? `${stat.width}%` : '0%',
                    transitionDelay: '300ms',
                  }}
                />
              </div>
              <span className="w-[90px] shrink-0 whitespace-nowrap text-right text-text">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-7 flex gap-3">
          <button
            onClick={() => openWindow('about')}
            className="rounded border border-border px-5 py-2.5 font-mono text-sm text-muted transition-colors hover:border-muted hover:text-text"
          >
            Conoc&eacute; el club
          </button>
          <button
            onClick={() => openWindow('form')}
            className="rounded bg-accent px-5 py-2.5 font-mono text-sm text-white transition-colors hover:bg-accent-h"
          >
            Quiero ser parte
          </button>
        </div>
      </div>
    </div>
  )
}
