import { useEffect, useRef, useState, useCallback } from 'react'
import { useDesktopStore } from '../../store/useDesktopStore'
import { bootLines } from './bootLines'

type Phase = 'logo' | 'log' | 'progress' | 'splash' | 'done'

const DELAYS = {
  logoFadeIn: 800,
  progressStep: 28,
  fadeOut: 400,
  splashHold: 1800,
}

function getBarWidth(): number {
  const vw = window.innerWidth
  const availPx = Math.min(vw - 48, 720)
  const baseFontPx = Math.min(Math.max(14, 1.5 * vw / 100 + 9), 17)  // clamp global
  const smFontPx = baseFontPx * 0.875              // text-sm = 0.875rem
  const charPx = smFontPx * 0.601                  // JetBrains Mono ~0.6em por char
  const totalChars = Math.floor(availPx / charPx)
  const overhead = 28                              // "iniciando sistema... [" + "] 100%"
  return Math.max(8, totalChars - overhead)
}

function getLineDelay(index: number): number {
  if (index < 3) return 100
  if (index < 8) return 140
  return 160
}

function buildAsciiBar(pct: number, width: number): string {
  const filled = Math.round((pct / 100) * width)
  const empty = width - filled
  return '[' + '#'.repeat(filled) + '-'.repeat(empty) + ']'
}

const typeColor = (type: string): string =>
  ({
    ok: '#00cc66',
    warn: '#ffff00',
    err: '#cc0000',
    info: '#e8e8e8',
  })[type] ?? '#e8e8e8'

export default function BootSequence() {
  const setBootCompleted = useDesktopStore((s) => s.setBootCompleted)

  const [phase, setPhase] = useState<Phase>('logo')
  const [lineIndex, setLineIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [splashVisible, setSplashVisible] = useState(false)
  const [splashFading, setSplashFading] = useState(false)
  const [bootFading, setBootFading] = useState(false)
  const [logoError, setLogoError] = useState(false)

  // iOS Safari viewport fix: 100vh incluye la barra de navegación del browser,
  // lo que puede ocultar contenido. window.innerHeight devuelve la altura visible real.
  const [vh, setVh] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 0,
  )

  const logRef = useRef<HTMLDivElement>(null)
  const timersRef = useRef<number[]>([])

  const addTimer = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay)
    timersRef.current.push(id)
    return id
  }, [])

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => clearTimeout(id))
    }
  }, [])

  // Mantener vh sincronizado cuando iOS Safari muestra/oculta la barra de navegación
  useEffect(() => {
    const update = () => setVh(window.innerHeight)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Phase 1: Logo fade-in → start log
  useEffect(() => {
    if (phase !== 'logo') return
    addTimer(() => setPhase('log'), DELAYS.logoFadeIn)
  }, [phase, addTimer])

  // Phase 2: Log lines one by one
  useEffect(() => {
    if (phase !== 'log') return
    if (lineIndex >= bootLines.length) {
      setPhase('progress')
      return
    }
    const delay = getLineDelay(lineIndex)
    addTimer(() => setLineIndex((i) => i + 1), delay)
  }, [phase, lineIndex, addTimer])

  // Auto-scroll after each new line is rendered
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [lineIndex])

  // Update progress during log phase (fills to ~60%)
  const logProgress =
    phase === 'log' || phase === 'progress'
      ? Math.round((lineIndex / bootLines.length) * 60)
      : 0

  // Phase 3: Progress bar from 60% to 100%
  useEffect(() => {
    if (phase !== 'progress') return
    const start = 60
    let current = start
    const id = window.setInterval(() => {
      current += 2
      setProgress(current)
      if (current >= 100) {
        clearInterval(id)
        addTimer(() => {
          setBootFading(true)
          addTimer(() => {
            setPhase('splash')
          }, 500)
        }, 300)
      }
    }, DELAYS.progressStep)
    timersRef.current.push(id)
    return () => clearInterval(id)
  }, [phase, addTimer])

  // Phase 4: Splash — show logo PNG
  useEffect(() => {
    if (phase !== 'splash') return
    addTimer(() => setSplashVisible(true), 80)
    addTimer(() => {
      setSplashFading(true)
      addTimer(() => {
        setPhase('done')
        setBootCompleted()
      }, DELAYS.fadeOut + 100)
    }, DELAYS.splashHold)
  }, [phase, addTimer, setBootCompleted])

  const displayProgress = phase === 'progress' ? progress : logProgress

  // Altura real del viewport: fix para iOS Safari donde 100vh ≠ área visible
  const rootHeight = vh > 0 ? `${vh}px` : '100vh'

  return (
    <div
      className="relative w-full overflow-hidden font-mono text-sm"
      style={{ backgroundColor: '#0d0d0d', color: '#e8e8e8', height: rootHeight }}
    >
      {/* Boot screen (logo + log + progress) */}
      <div
        className="mx-auto flex max-w-5xl flex-col px-6"
        style={{
          height: '100%',
          opacity: bootFading ? 0 : 1,
          transition: 'opacity 0.5s ease-in',
        }}
      >
        {/* ASCII logo area */}
        <div
          className="flex flex-col items-center gap-2 pt-8 pb-6"
          style={{
            opacity: phase === 'logo' ? 0 : 1,
            transition: 'opacity 600ms ease-out',
          }}
        >
          <div className="text-center text-xs leading-tight tracking-wider">
            <span style={{ color: '#cc0000' }}>&gt;_</span>
            <br />
            <span style={{ color: '#e8e8e8' }}>ret</span>
            <span style={{ color: '#cc0000' }}>UNRN</span>
            <span style={{ color: '#cc0000' }}>;</span>
          </div>
          <div className="text-xs tracking-[0.15em]" style={{ color: '#666666' }}>
            RETUNRN OS v2026.1
          </div>
        </div>

        {/* Log area */}
        <div
          ref={logRef}
          className="scrollbar-hidden flex flex-1 flex-col gap-1 overflow-y-auto pb-6"
        >
          {bootLines.slice(0, lineIndex).map((line, i) => (
            <div
              key={i}
              className="animate-[slide-in_0.12s_ease_forwards] flex gap-2"
            >
              <span className="w-[110px] shrink-0 sm:w-[130px]" style={{ color: '#444' }}>
                {line.ts}
              </span>
              <span style={{ color: typeColor(line.type) }}>{line.msg}</span>
            </div>
          ))}

          {/* ASCII progress bar — inline as the next log line */}
          {(phase === 'log' || phase === 'progress') && (
            <div className="mt-1 whitespace-nowrap">
              <span style={{ color: '#888888' }}>iniciando sistema... </span>
              <span style={{ color: '#cc0000' }}>
                {buildAsciiBar(displayProgress, getBarWidth())}
              </span>
              <span style={{ color: '#888888' }}>
                {' '}
                {String(displayProgress).padStart(3, ' ')}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Logo splash overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black"
        style={{
          opacity: phase === 'splash' && !splashFading ? 1 : 0,
          pointerEvents: phase === 'splash' ? 'all' : 'none',
          transition: 'opacity 0.5s ease-in',
        }}
      >
        {logoError ? (
          <div
            className="font-mono text-4xl font-bold"
            style={{
              opacity: splashVisible && !splashFading ? 1 : 0,
              transform: splashFading
                ? 'scale(1.04)'
                : splashVisible
                  ? 'scale(1)'
                  : 'scale(0.88)',
              transition: 'all 550ms ease-out',
            }}
          >
            <span style={{ color: '#e8e8e8' }}>ret</span>
            <span style={{ color: '#cc0000' }}>UNRN</span>
          </div>
        ) : (
          <img
            src="/logo.png"
            alt="retUNRN"
            className="w-[min(280px,60vw)]"
            onError={() => setLogoError(true)}
            style={{
              opacity: splashVisible && !splashFading ? 1 : 0,
              transform: splashFading
                ? 'scale(1.04)'
                : splashVisible
                  ? 'scale(1)'
                  : 'scale(0.88)',
              transition: 'all 550ms ease-out',
            }}
          />
        )}
        <div
          className="h-px bg-accent"
          style={{
            width: splashVisible && !splashFading ? 'min(280px, 60vw)' : '0',
            transition: 'width 900ms ease-out 100ms',
          }}
        />
        <div
          className="font-mono text-xs tracking-[0.2em]"
          style={{
            color: '#333',
            opacity: splashVisible && !splashFading ? 1 : 0,
            transform:
              splashVisible && !splashFading ? 'translateY(0)' : 'translateY(5px)',
            transition: `all 500ms ease-out ${splashVisible && !splashFading ? '250ms' : '0ms'}`,
          }}
        >
          CLUB DE PROGRAMACI&Oacute;N &middot; UNRN &middot; BARILOCHE
        </div>
      </div>
    </div>
  )
}
