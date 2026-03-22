import { create } from 'zustand'

export type AppId =
  | 'welcome'
  | 'about'
  | 'projects'
  | 'calendar'
  | 'contact'
  | 'terminal'
  | 'form'

export interface WindowState {
  id: AppId
  minimized: boolean
  zIndex: number
}

export interface TerminalLine {
  type: 'input' | 'output' | 'error'
  content: string
}

interface DesktopStore {
  bootCompleted: boolean
  setBootCompleted: () => void

  theme: 'dark' | 'light'
  toggleTheme: () => void

  windows: WindowState[]
  openWindow: (id: AppId) => void
  closeWindow: (id: AppId) => void
  minimizeWindow: (id: AppId) => void
  focusWindow: (id: AppId) => void
  topZIndex: number

  terminalHistory: TerminalLine[]
  pushTerminalLine: (line: TerminalLine) => void
  clearTerminal: () => void
}

const getInitialTheme = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  bootCompleted: false,
  setBootCompleted: () => set({ bootCompleted: true }),

  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      if (next === 'dark') {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
      }
      return { theme: next }
    }),

  windows: [],
  topZIndex: 1,

  openWindow: (id) =>
    set((state) => {
      const existing = state.windows.find((w) => w.id === id)
      if (existing) {
        return {
          windows: state.windows.map((w) =>
            w.id === id
              ? { ...w, minimized: false, zIndex: state.topZIndex + 1 }
              : w,
          ),
          topZIndex: state.topZIndex + 1,
        }
      }
      return {
        windows: [
          ...state.windows,
          { id, minimized: false, zIndex: state.topZIndex + 1 },
        ],
        topZIndex: state.topZIndex + 1,
      }
    }),

  closeWindow: (id) =>
    set((state) => {
      const remaining = state.windows.filter((w) => w.id !== id)
      if (remaining.length === 0) return { windows: [] }
      const next = remaining.reduce((a, b) => (a.zIndex > b.zIndex ? a : b))
      return {
        windows: remaining.map((w) =>
          w.id === next.id
            ? { ...w, zIndex: state.topZIndex + 1 }
            : w,
        ),
        topZIndex: state.topZIndex + 1,
      }
    }),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w,
      ),
    })),

  focusWindow: (id) => {
    const { topZIndex } = get()
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: topZIndex + 1 } : w,
      ),
      topZIndex: topZIndex + 1,
    }))
  },

  terminalHistory: [],
  pushTerminalLine: (line) =>
    set((state) => ({
      terminalHistory: [...state.terminalHistory, line],
    })),
  clearTerminal: () => set({ terminalHistory: [] }),
}))
