import { X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface WindowTitlebarProps {
  title: string
  icon: LucideIcon
  onClose: () => void
  onPointerDown: () => void
  hideBorder?: boolean
}

export default function WindowTitlebar({
  title,
  icon: Icon,
  onClose,
  onPointerDown,
  hideBorder = false,
}: WindowTitlebarProps) {
  return (
    <div
      className={`flex h-10 items-center bg-surface-2 px-4 select-none ${hideBorder ? '' : 'border-b border-border'}`}
      onPointerDown={onPointerDown}
    >
      {/* Left: icon + title */}
      <div className="flex flex-1 items-center gap-2">
        <Icon size={14} className="shrink-0 text-text/70" />
        <span className="truncate font-mono text-xs text-text/70">{title}</span>
      </div>

      {/* Right: close button */}
      <button
        onPointerUp={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="group relative -mr-2 ml-2 flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center"
        aria-label="Cerrar"
      >
        <span className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-border transition-colors group-hover:bg-accent">
          <X
            size={8}
            className="opacity-0 transition-opacity group-hover:opacity-100 [@media(hover:none)]:opacity-100"
            style={{ color: '#ffffff' }}
            strokeWidth={2.5}
          />
        </span>
      </button>
    </div>
  )
}
