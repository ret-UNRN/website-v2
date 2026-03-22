import { useEffect, useState, type ComponentType } from 'react'
import { Circle, Github, Mail } from 'lucide-react'
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Active window: highest zIndex, not minimized
  const activeWindow = windows
    .filter((w) => !w.minimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0]

  const hasActiveWindow = !!activeWindow

  const handleHome = () => {
    if (activeWindow) minimizeWindow(activeWindow.id)
  }

  const handleIconClick = (id: AppId) => {
    const isOpen = windows.some((w) => w.id === id && !w.minimized)
    if (isOpen) {
      focusWindow(id)
    } else {
      openWindow(id)
    }
  }

  const timeStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`

  return (
    <div className="flex h-full flex-col bg-bg">
      {/* Status bar */}
      <div className="relative flex h-11 shrink-0 items-center border-b border-border bg-surface px-4 font-mono text-xs transition-colors">
        <span className="text-muted">
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

      {/* Content area */}
      <div className="relative min-h-0 flex-1 overflow-hidden">

        {/* Home screen — widget + grid */}
        <div
          className="absolute inset-0 flex flex-col transition-opacity duration-200"
          style={{ opacity: hasActiveWindow ? 0 : 1, pointerEvents: hasActiveWindow ? 'none' : 'auto' }}
        >
          {/* Widget */}
          <div className="mx-4 mt-4 rounded-2xl border border-border bg-surface px-4 py-4">
            <p className="mb-0.5 font-mono text-[11px] text-muted">Club de Programación</p>
            <p className="font-mono text-lg font-bold leading-tight text-text">
              ret<span className="text-accent">UNRN</span>
            </p>
            <p className="mt-1.5 mb-3 font-mono text-[11px] leading-relaxed text-text/60">
              Espacio extracurricular de programación de la UNRN Sede Andina, Bariloche.
            </p>

            {[
              { label: 'actividad', width: 82 },
              { label: 'proyectos', width: 60 },
              { label: 'miembros',  width: 100 },
            ].map((s) => (
              <div key={s.label} className="mb-1.5 flex items-center gap-3 font-mono text-[11px]">
                <span className="w-14 shrink-0 text-muted">{s.label}</span>
                <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-out"
                    style={{ width: mounted ? `${s.width}%` : '0%', transitionDelay: '200ms' }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-3 mb-3 flex gap-1.5">
              <button
                onClick={() => handleIconClick('about')}
                className="flex-1 touch-manipulation rounded-lg border border-border py-2 font-mono text-xs text-muted transition-colors active:text-text"
              >
                Conocé el club
              </button>
              <button
                onClick={() => handleIconClick('form')}
                className="flex-1 touch-manipulation rounded-lg bg-accent py-2 font-mono text-xs font-medium text-white transition-colors active:bg-accent-h"
              >
                Quiero ser parte
              </button>
            </div>

          </div>

          {/* App grid — two rows */}
          <div className="mt-auto grid grid-cols-3 gap-x-2 gap-y-3 px-6 pb-5">
            {/* Row 1: apps */}
            {APPS.filter((a) => !['welcome', 'about', 'contact', 'form'].includes(a.id)).map((app) => {
              const Icon = app.icon
              const isOpen = windows.some((w) => w.id === app.id && !w.minimized)
              return (
                <button
                  key={app.id}
                  onClick={() => handleIconClick(app.id as AppId)}
                  className="flex flex-col items-center gap-1.5 touch-manipulation active:scale-95 transition-transform duration-100"
                >
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-sm">
                    <Icon size={24} className="text-text/70" />
                    {isOpen && (
                      <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
                    )}
                  </div>
                  <span className="w-full text-center font-mono text-[10px] leading-tight text-text/60 md:text-xs">
                    {app.label}
                  </span>
                </button>
              )
            })}
            {/* Row 2: links */}
            <a
              href="https://discord.gg/PENDIENTE"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 touch-manipulation active:scale-95 transition-transform duration-100"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-sm">
                <DiscordIcon size={24} />
              </div>
              <span className="w-full text-center font-mono text-[10px] leading-tight text-text/60 md:text-xs">discord</span>
            </a>
            <a
              href="https://github.com/ret-unrn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 touch-manipulation active:scale-95 transition-transform duration-100"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-sm">
                <Github size={24} className="text-text/70" />
              </div>
              <span className="w-full text-center font-mono text-[10px] leading-tight text-text/60 md:text-xs">github</span>
            </a>
            <button
              onClick={() => handleIconClick('contact')}
              className="flex flex-col items-center gap-1.5 touch-manipulation active:scale-95 transition-transform duration-100"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-sm">
                <Mail size={24} className="text-text/70" />
              </div>
              <span className="w-full text-center font-mono text-[10px] leading-tight text-text/60 md:text-xs">contacto</span>
            </button>
          </div>
        </div>

        {/* Active window — fullscreen */}
        {windows.map((win) => {
          const app = APPS.find((a) => a.id === win.id)
          const AppComponent = APP_COMPONENTS[win.id]
          if (!AppComponent || win.minimized || !app) return null

          return (
            <div
              key={win.id}
              className="absolute inset-0 flex flex-col bg-surface transition-opacity duration-150"
              style={{ zIndex: win.zIndex }}
            >
              <div className="min-h-0 flex-1 overflow-auto">
                <AppComponent />
              </div>
            </div>
          )
        })}

        {/* Recents overlay */}
      </div>

      {/* Nav bar — single home button */}
      <div className="mobile-safe-bottom shrink-0 border-t border-border bg-surface transition-colors">
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
