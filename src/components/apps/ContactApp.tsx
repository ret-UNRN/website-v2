import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useWindowSize } from '../../hooks/useWindowSize'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactApp() {
  const [status, setStatus] = useState<Status>('idle')
  const { isMobile, isTablet } = useWindowSize()
  const padding = isMobile ? 'px-4 py-4' : isTablet ? 'px-5 py-5' : 'px-6 py-6'
  const bodyText = isMobile ? 'text-xs' : 'text-sm'
  const sectionTitle = 'text-sm'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/REEMPLAZAR_ID', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClasses = `w-full rounded border border-border bg-surface-2 px-3 py-2 font-mono ${bodyText} text-text placeholder-muted/50 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30`

  if (status === 'sent') {
    return (
      <div className={`flex h-full flex-col items-center justify-center gap-4 ${padding}`}>
        <CheckCircle size={48} className="text-green" />
        <div className="text-center space-y-1">
          <p className={`font-mono font-bold text-green ${bodyText}`}>mensaje enviado</p>
          <p className={`font-mono text-muted ${bodyText}`}>
            te respondemos desde{' '}
            <span className="text-accent">info@retunrn.org</span>
          </p>
        </div>
        <p className="font-mono text-xs text-green">$ sent → OK (200)</p>
        <button
          onClick={() => setStatus('idle')}
          className={`font-mono text-accent transition-colors hover:text-accent-h ${bodyText}`}
        >
          ↻ enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <div className={`h-full overflow-auto ${padding}`}>
      <div className={`mx-auto max-w-2xl ${isMobile ? 'space-y-5' : 'space-y-6'}`}>

        {/* Header */}
        <div style={{ animation: 'slide-in 220ms ease-out both', animationDelay: '0ms' }}>
          <h2 className={`font-mono font-bold text-text ${isMobile ? 'text-lg' : 'text-2xl'}`}>
            Escribinos!
          </h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ animation: 'slide-in 220ms ease-out both', animationDelay: '80ms' }}
          className={isMobile ? 'space-y-4' : 'space-y-5'}
        >
          {/* Nombre */}
          <div className="space-y-1">
            <p className={`font-mono ${sectionTitle} text-accent`}># Nombre</p>
            <input
              name="nombre"
              type="text"
              required
              placeholder="ej: Jose Pérez"
              className={inputClasses}
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <p className={`font-mono ${sectionTitle} text-accent`}># Mail</p>
            <input
              name="email"
              type="email"
              required
              placeholder="ej: josesitokapo2005@yahoo.com.ar"
              className={inputClasses}
            />
          </div>

          {/* Tema */}
          <div className="space-y-1">
            <p className={`font-mono ${sectionTitle} text-accent`}># Tema</p>
            <select name="tema" defaultValue="consulta" className={inputClasses}>
              <option value="consulta">Consulta general</option>
              <option value="proyecto">Tengo un proyecto</option>
              <option value="evento">Organizar un evento</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {/* Mensaje */}
          <div className="space-y-1">
            <p className={`font-mono ${sectionTitle} text-accent`}># Mensaje</p>
            <textarea
              name="mensaje"
              required
              rows={isMobile ? 3 : 4}
              placeholder="Son el mejor club del mundo..."
              className={`${inputClasses} resize-none`}
            />
          </div>

          {/* Error */}
          {status === 'error' && (
            <div className="flex items-center gap-2 rounded border border-accent/50 bg-accent/5 px-3 py-2">
              <AlertCircle size={12} className="shrink-0 text-accent" />
              <p className={`font-mono text-accent ${bodyText}`}>Error: intentá de nuevo</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'sending'}
            className={`flex items-center gap-2 rounded bg-accent px-4 py-2 font-mono font-semibold text-white transition-colors hover:bg-accent-h disabled:opacity-50 disabled:cursor-not-allowed ${bodyText}`}
          >
            {status === 'sending' ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                enviando...
              </>
            ) : (
              <>
                <Send size={12} />
                enviar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
