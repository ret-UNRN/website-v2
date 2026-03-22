import { useRef } from 'react'
import { Rnd } from 'react-rnd'
import type { LucideIcon } from 'lucide-react'
import WindowTitlebar from './WindowTitlebar'
import { useDesktopStore } from '../../store/useDesktopStore'
import { useWindowSize } from '../../hooks/useWindowSize'
import type { AppId } from '../../store/useDesktopStore'

const TOP_PANEL_H = 32
const GAP = 8
const ICONS_COL_W = 140
const CASCADE_STEP = 14

interface WindowProps {
  id: AppId
  title: string
  icon: LucideIcon
  children: React.ReactNode
  defaultPosition?: { x: number; y: number }
  defaultSize?: { width: number; height: number }
}

export default function Window({
  id,
  title,
  icon,
  children,
  defaultPosition,
  defaultSize,
}: WindowProps) {
  const closeWindow = useDesktopStore((s) => s.closeWindow)
  const focusWindow = useDesktopStore((s) => s.focusWindow)
  const win = useDesktopStore((s) => s.windows.find((w) => w.id === id))
  const winIndex = useDesktopStore((s) => s.windows.findIndex((w) => w.id === id))
  const topZIndex = useDesktopStore((s) => s.topZIndex)
  const isActive = win?.zIndex === topZIndex
  const { isMobile, isTablet, width, height } = useWindowSize()
  const rndRef = useRef<Rnd>(null)

  if (!win || win.minimized) return null

  const handleFocus = () => focusWindow(id)

  const titlebar = (
    <WindowTitlebar
      title={title}
      icon={icon}
      onClose={() => closeWindow(id)}
      onPointerDown={handleFocus}
      hideBorder={isMobile}
    />
  )

  // Mobile: fullscreen between topbar (44px) and bottom nav (64px + safe area)
  if (isMobile) {
    return (
      <div
        className="fixed inset-x-0 flex flex-col overflow-hidden bg-surface animate-[window-open_200ms_ease-out]"
        style={{ zIndex: win.zIndex, top: 44, bottom: 64 }}
        onPointerDown={handleFocus}
      >
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </div>
    )
  }

  // Tablet: nearly full area below top panel
  if (isTablet) {
    const w = width - GAP * 2
    const h = height - TOP_PANEL_H - GAP * 2
    return (
      <div
        className="fixed flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl animate-[window-open_150ms_ease-out]"
        style={{
          zIndex: win.zIndex,
          width: w,
          height: h,
          top: TOP_PANEL_H + GAP,
          left: GAP,
        }}
        onPointerDown={handleFocus}
      >
        {titlebar}
        <div className="min-w-0 flex-1 overflow-auto">{children}</div>
      </div>
    )
  }

  // Desktop: react-rnd — cascade from base position using window index
  const availH = height - TOP_PANEL_H
  const topGap = GAP + TOP_PANEL_H
  const areaLeft = ICONS_COL_W
  const areaW = width - areaLeft
  const cascade = winIndex * CASCADE_STEP
  const defW = defaultSize?.width ?? (areaW - GAP * 2) * 0.9
  const defH = defaultSize?.height ?? (availH - topGap - GAP) * 0.9
  const centerX = areaLeft + areaW / 2
  const defX = defaultPosition?.x ?? centerX - defW / 2 + cascade
  const defY = defaultPosition?.y ?? topGap + GAP + cascade

  return (
    <Rnd
      ref={rndRef}
      default={{
        x: defX,
        y: defY,
        width: defW,
        height: defH,
      }}
      minWidth={360}
      minHeight={280}
      bounds="parent"
      dragHandleClassName="rnd-drag-handle"
      style={{ zIndex: win.zIndex }}
      onMouseDown={handleFocus}
      className="animate-[window-open_150ms_ease-out]"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
        <div className="rnd-drag-handle">{titlebar}</div>
        <div className="min-w-0 flex-1 overflow-auto">{children}</div>
        {!isActive && (
          <div className="window-inactive-overlay absolute inset-0 rounded-xl pointer-events-none" />
        )}
      </div>
    </Rnd>
  )
}
