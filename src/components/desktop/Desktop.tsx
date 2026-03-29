import { useEffect, type ComponentType } from 'react'
import { useDesktopStore } from '../../store/useDesktopStore'
import { APPS } from '../../constants/apps'
import DesktopIcon from './DesktopIcon'
import Taskbar from './Taskbar'
import MobileDesktop from './MobileDesktop'
import Window from '../window/Window'
import WelcomeApp from '../apps/WelcomeApp'
import AboutApp from '../apps/AboutApp'
import ProjectsApp from '../apps/ProjectsApp'
import CalendarApp from '../apps/CalendarApp'
import ContactApp from '../apps/ContactApp'
import TerminalApp from '../apps/TerminalApp'
import FormApp from '../apps/FormApp'
import type { AppId } from '../../store/useDesktopStore'
import { useWindowSize } from '../../hooks/useWindowSize'

const APP_COMPONENTS: Record<AppId, ComponentType> = {
  welcome: WelcomeApp,
  about: AboutApp,
  projects: ProjectsApp,
  calendar: CalendarApp,
  contact: ContactApp,
  terminal: TerminalApp,
  form: FormApp,
}

const APP_TITLES: Record<AppId, string> = {
  welcome: 'inicio',
  about: 'quienes-somos',
  projects: 'proyectos',
  calendar: 'agenda',
  contact: 'contacto',
  terminal: 'terminal',
  form: 'inscripcion',
}

export default function Desktop() {
  const { isMobile, isTablet } = useWindowSize()
  const windows = useDesktopStore((s) => s.windows)
  const openWindow = useDesktopStore((s) => s.openWindow)
  const focusWindow = useDesktopStore((s) => s.focusWindow)

  const isMobileLayout = isMobile || isTablet

  // Open WelcomeApp on first render after boot (desktop only; mobile handles this itself)
  useEffect(() => {
    if (!isMobileLayout) openWindow('welcome')
  }, [isMobileLayout, openWindow])

  if (isMobileLayout) return <MobileDesktop />

  const handleIconClick = (id: AppId) => {
    const win = windows.find((w) => w.id === id)
    if (win && !win.minimized) {
      focusWindow(id)
    } else {
      openWindow(id) // handles both new windows and restoring minimized ones
    }
  }

  return (
    <main className="desktop-grid isolate relative flex h-full flex-col">
      {/* GNOME-style top panel */}
      <Taskbar />

      {/* Desktop area: icon sidebar + window area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Icon sidebar — full height, icons distributed evenly */}
        <div className="flex w-[90px] shrink-0 flex-col justify-around py-2 pl-2">
          {APPS.map((app, i) => (
            <div
              key={app.id}
              style={{ animation: 'slide-in 180ms ease-out both', animationDelay: `${i * 40}ms` }}
            >
              <DesktopIcon
                label={app.label}
                icon={app.icon}
                isOpen={windows.some((w) => w.id === app.id)}
                onClick={() => handleIconClick(app.id as AppId)}
              />
            </div>
          ))}
        </div>

        {/* Window area — windows are bounded here */}
        <div className="relative flex-1 overflow-hidden">
          {windows.map((win) => {
            const app = APPS.find((a) => a.id === win.id)
            const AppComponent = APP_COMPONENTS[win.id]
            if (!AppComponent) return null
            const icon = app?.icon ?? APPS[0].icon

            return (
              <Window
                key={win.id}
                id={win.id}
                title={APP_TITLES[win.id]}
                icon={icon}
              >
                <AppComponent />
              </Window>
            )
          })}
        </div>
      </div>
    </main>
  )
}
