import { Home, User, FolderGit2, Calendar, Mail, Terminal, ClipboardList } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { AppId } from '../store/useDesktopStore'

export interface AppDefinition {
  id: AppId
  label: string
  icon: LucideIcon
  hasWindow: boolean
}

export const APPS: AppDefinition[] = [
  { id: 'welcome', label: 'inicio', icon: Home, hasWindow: true },
  { id: 'about', label: 'quienes-somos', icon: User, hasWindow: true },
  { id: 'form', label: 'inscripcion', icon: ClipboardList, hasWindow: true },
  { id: 'projects', label: 'proyectos', icon: FolderGit2, hasWindow: true },
  { id: 'calendar', label: 'agenda', icon: Calendar, hasWindow: true },
  { id: 'contact', label: 'contacto', icon: Mail, hasWindow: true },
  { id: 'terminal', label: 'terminal', icon: Terminal, hasWindow: true },
]
