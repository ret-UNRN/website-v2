import { useEffect, useState, type ComponentType } from 'react'
import { Circle, Github, Mail, ChevronLeft } from 'lucide-react'
import DiscordIcon from '../ui/DiscordIcon'
import { useDesktopStore } from '../../store/useDesktopStore'
import type { AppId } from '../../store/useDesktopStore'
import { APPS } from '../../constants/apps'
import ThemeToggle from '../ui/ThemeToggle'
import WelcomeApp from '../apps/WelcomeApp'
import AboutApp from '../apps/AboutApp'
import ProjectsApp from '../apps/ProjectsApp'
import CalendarApp from '../apps/CalendarApp'
import ContactApp from '../apps/ContactApp'
import TerminalApp from '../apps/TerminalApp'
import FormApp from '../apps/FormApp'

const APP_COMPONENTS: Record<AppId, ComponentType> = {
  welcome: WelcomeApp,
  about: AboutApp,
  projects: ProjectsApp,
  calendar: CalendarApp,
  contact: ContactApp,
  terminal: TerminalApp,
  form: FormApp,
}


export default function MobileDesktop() {
  const windows = useDesktopStore((s) => s.windows)
  const openWindow = useDesktopStore((s) => s.openWindow)
  const minimizeWindow = useDesktopStore((s) => s.minimizeWindow)
  const focusWindow = useDesktopStore((s) => s.focusWindow)



  const [time, setTime] = useState(() => new Date())
  const [closingId, setClosingId] = useState<AppId | null>(null)
  const [launchingId, setLaunchingId] = useState<AppId | null>(null)
  const [displayCount, setDisplayCount] = useState(0)
  const [resolved, setResolved] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    fetch('/api/inscripciones-count')
      .then((res) => res.json())
      .then((data) => {
        const total: number = data.total ?? 0
        setResolved(true)
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

  // Active window: highest zIndex, not minimized
  const activeWindow = windows
    .filter((w) => !w.minimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0]

  const hasActiveWindow = !!activeWindow

  const handleHome = () => {
    if (!activeWindow) return
    setClosingId(activeWindow.id)
    setTimeout(() => {
      minimizeWindow(activeWindow.id)
      setClosingId(null)
    }, 180)
  }

  const handleIconClick = (id: AppId) => {
    const isOpen = windows.some((w) => w.id === id && !w.minimized)
    if (isOpen) {
      focusWindow(id)
    } else {
      setLaunchingId(id)
      setTimeout(() => {
        openWindow(id)
        setLaunchingId(null)
      }, 120)
    }
  }

  const timeStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`

  return (
    <div className="desktop-grid fixed inset-0">
      {/* Status bar */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-11 items-center border-b border-border bg-surface px-4 font-mono text-xs transition-colors">
        <span className="text-text">
          ret<span className="font-bold text-accent">UNRN</span>
          <span className="ml-1 text-muted/50">OS</span>
        </span>
        <div className="absolute left-1/2 -translate-x-1/2">
          <span className="font-mono text-xs text-text/80">{timeStr}</span>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>


      {/* Content area — between bars */}
      <div className="fixed inset-x-0 top-[2.75rem] bottom-[2.75rem] overflow-hidden">

        {/* Home screen — widget + grid */}
        <div
          className="absolute inset-0 flex flex-col transition-opacity duration-200"
          style={{ opacity: hasActiveWindow ? 0 : 1, pointerEvents: hasActiveWindow ? 'none' : 'auto' }}
        >
          {/* Widget */}
          <div className="mx-3 mt-3 rounded-2xl border border-border bg-surface px-4 py-3 animate-[slide-in_250ms_ease-out_both] space-y-2.5">
            {/* Header with member counter */}
            <div className="flex items-start justify-between gap-2">
              {/* Meta + Heading */}
              <div>
                <p className="font-mono text-[0.65rem] tracking-wider text-muted">
                  // Bariloche - Argentina · <span className="text-accent">2026</span>
                </p>
                <h1 className="mt-1 font-mono text-base font-bold leading-tight text-text">
                  Club de
                  <br />
                  Programación
                </h1>
                <div className="font-mono text-base font-bold leading-tight text-text">
                  ret<span className="text-accent">UNRN</span>
                </div>
              </div>

              {/* Member counter — compact, top right */}
              <div className={`flex items-center gap-1 rounded border px-2 py-1.5 shrink-0 transition-all duration-700 ${resolved ? 'border-green/30 bg-green/5' : 'border-yellow-500/30 bg-yellow-500/5'}`}>
                <div
                  className={`h-1 w-1 rounded-full shrink-0 transition-colors duration-700 ${resolved ? 'bg-green' : 'bg-yellow-400'}`}
                  style={resolved ? undefined : { animation: 'pulse 800ms ease-in-out infinite' }}
                />
                {!resolved ? (
                  <span className="font-mono text-[0.6rem] text-yellow-400 whitespace-nowrap">...</span>
                ) : (
                  <div className="font-mono text-[0.6rem] text-text whitespace-nowrap" style={{ animation: 'slide-up 300ms ease-out both' }}>
                    <span className="text-green tabular-nums" style={{ animation: 'count-pop 500ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
                      {displayCount}
                    </span>
                    <span className="text-muted"> miembros</span>
                  </div>
                )}
              </div>
            </div>

            {/* Prompt */}
            <div>
              <p className="font-mono text-[0.7rem] text-green">
                &gt;&gt;&gt; <span className="text-text">Un espacio abierto y colaborativo</span>
              </p>
            </div>

            {/* Activities list — comprimido */}
            <div>
              <p className="mb-1.5 font-mono text-[0.65rem] font-bold text-accent">¿Qué podés hacer?</p>
              <ul className="space-y-1 font-mono text-[0.65rem] text-text/80">
                <li className="flex gap-1.5">
                  <span className="shrink-0 text-green">→</span>
                  <span>Entrenar para competencias</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="shrink-0 text-green">→</span>
                  <span>Proyectos open-source</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="shrink-0 text-green">→</span>
                  <span>Aprender y crecer</span>
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-1.5 pt-1">
              <button
                onClick={() => handleIconClick('about')}
                className="flex-1 touch-manipulation rounded-lg border border-border px-3 py-1.5 font-mono text-[0.7rem] text-text transition-colors active:bg-surface-2"
                style={{ animation: launchingId === 'about' ? 'icon-launch 120ms ease-out both' : undefined }}
              >
                Conocé el club
              </button>
              <button
                onClick={() => handleIconClick('form')}
                className="flex-1 touch-manipulation rounded-lg bg-accent px-3 py-1.5 font-mono text-[0.7rem] font-medium text-white transition-colors active:bg-accent-h"
                style={{ animation: launchingId === 'form' ? 'icon-launch 120ms ease-out both' : undefined }}
              >
                Quiero ser parte
              </button>
            </div>

          </div>

          {/* App grid — two rows */}
          <div className="mt-auto grid grid-cols-3 gap-x-2 gap-y-3 px-6 pb-5">
            {/* Row 1: apps */}
            {APPS.filter((a) => !['welcome', 'about', 'contact', 'form'].includes(a.id)).map((app, i) => {
              const Icon = app.icon
              const isOpen = windows.some((w) => w.id === app.id && !w.minimized)
              return (
                <div
                  key={app.id}
                  style={{ animation: 'slide-in 200ms ease-out both', animationDelay: `${i * 50 + 100}ms` }}
                >
                  <button
                    onClick={() => handleIconClick(app.id as AppId)}
                    className="flex flex-col items-center gap-1.5 touch-manipulation w-full"
                    style={{ animation: launchingId === app.id ? 'icon-launch 120ms ease-out both' : undefined }}
                  >
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-sm">
                      <Icon size={24} className="text-text/70" />
                      {isOpen && (
                        <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
                      )}
                    </div>
                    <span className="w-full text-center font-mono text-[0.7rem] leading-tight text-text/60">
                      {app.label}
                    </span>
                  </button>
                </div>
              )
            })}
            {/* Row 2: links */}
            <a
              href="https://discord.gg/eFwypv6w"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 touch-manipulation active:scale-95 transition-transform duration-100"
              style={{ animation: 'slide-in 200ms ease-out both', animationDelay: '250ms' }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-sm">
                <DiscordIcon size={24} />
              </div>
              <span className="w-full text-center font-mono text-[0.7rem] leading-tight text-text/60">discord</span>
            </a>
            <a
              href="https://github.com/ret-unrn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 touch-manipulation active:scale-95 transition-transform duration-100"
              style={{ animation: 'slide-in 200ms ease-out both', animationDelay: '300ms' }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-sm">
                <Github size={24} className="text-text/70" />
              </div>
              <span className="w-full text-center font-mono text-[0.7rem] leading-tight text-text/60">github</span>
            </a>
            <div style={{ animation: 'slide-in 200ms ease-out both', animationDelay: '350ms' }}>
              <button
                onClick={() => handleIconClick('contact')}
                className="flex w-full flex-col items-center gap-1.5 touch-manipulation"
                style={{ animation: launchingId === 'contact' ? 'icon-launch 120ms ease-out both' : undefined }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-sm">
                  <Mail size={24} className="text-text/70" />
                </div>
                <span className="w-full text-center font-mono text-[0.7rem] leading-tight text-text/60">contacto</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recents overlay */}
      </div>

      {/* Active window — fixed, fuera del overflow-hidden para que la animación sea visible */}
      {windows.map((win) => {
        const app = APPS.find((a) => a.id === win.id)
        const AppComponent = APP_COMPONENTS[win.id]
        if (!AppComponent || win.minimized || !app) return null
        const Icon = app.icon

        return (
          <div
            key={win.id}
            className="fixed inset-x-0 flex flex-col bg-surface"
            style={{
              top: '2.75rem',
              bottom: '2.75rem',
              zIndex: win.zIndex,
              animation: closingId === win.id
                ? 'slide-down 180ms ease-in both'
                : 'slide-up 200ms ease-out both',
            }}
          >
            {/* Nav bar integrada: volver + título */}
            <div
              className="flex h-10 shrink-0 items-center border-b border-border px-1"
              style={{ animation: 'back-btn-in 250ms cubic-bezier(0.34,1.56,0.64,1) both', animationDelay: '60ms' }}
            >
              <button
                onClick={handleHome}
                className="flex items-center gap-0.5 touch-manipulation rounded-lg px-2 py-2 text-text/60 active:bg-surface-2 active:text-text"
                aria-label="Volver"
              >
                <ChevronLeft size={16} strokeWidth={2} />
                <span className="font-mono text-xs">volver</span>
              </button>
              <div className="flex flex-1 items-center justify-center gap-1.5">
                <Icon size={12} className="text-text/50" />
                <span className="font-mono text-xs text-text/60">{app.label}</span>
              </div>
              {/* Spacer invisible para centrar el título visualmente */}
              <div className="flex items-center gap-0.5 px-2 py-2 invisible pointer-events-none" aria-hidden="true">
                <ChevronLeft size={16} strokeWidth={2} />
                <span className="font-mono text-xs">volver</span>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              <AppComponent />
            </div>
          </div>
        )
      })}

      {/* Nav bar — single home button */}
      <div className="mobile-safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface transition-colors">
        <div className="flex h-11 items-center justify-center">
          <button
            onClick={handleHome}
            className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-full text-muted transition-colors active:text-text"
            aria-label="Inicio"
          >
            <Circle size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
