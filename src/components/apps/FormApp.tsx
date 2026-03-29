import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useWindowSize } from '../../hooks/useWindowSize'

type Status = 'idle' | 'sending' | 'sent' | 'error'
type Origen = 'universidad' | 'escuela' | 'otro' | ''

const UNIVERSIDADES = [
  'UNRN — Universidad Nacional de Río Negro',
  'UNCo — Universidad Nacional del Comahue',
  'Instituto Balseiro',
  'UTN — Universidad Tecnológica Nacional',
  'Universidad FASTA',
  'Universidad Kennedy',
  'IFDC — Instituto de Formación Docente Continua',
  'ISETP — Instituto Superior de Educación Técnica Profesional',
  'Instituto Superior Patagónico',
  'Otra',
]

const ESCUELAS = [
  // Públicas
  'ESRN N° 2',
  'ESRN N° 20',
  'ESRN N° 33',
  'ESRN N° 36',
  'ESRN N° 37',
  'ESRN N° 44',
  'ESRN N° 45',
  'ESRN N° 46',
  'ESRN N° 51',
  'ESRN N° 77',
  'ESRN N° 96',
  'ESRN N° 97',
  'ESRN N° 99',
  'ESRN N° 104',
  'ESRN N° 105',
  'ESRN N° 123',
  'ESRN N° 132',
  'ESRN N° 138',
  'ESRN N° 143',
  'CET N° 2 — Escuela Técnica Jorge Newbery',
  'CET N° 25',
  'CET N° 28',
  'CENS N° 4',
  'CENS N° 5',
  'CENS N° 6',
  'CENS N° 9',
  // Privadas
  'Colegio Amuyen',
  'Colegio Antu Ruca',
  'Colegio Castex',
  'Colegio Ceferino Namuncura',
  'Colegio del Sol',
  'Colegio Don Bosco',
  'Colegio Jean Piaget',
  'Colegio María Auxiliadora',
  'Colegio QMark',
  'Colegio San Esteban',
  'Colegio San Patricio',
  'Colegio Siglo XXI',
  'Colegio Tecnológico del Sur',
  'Escuela Cooperativa Técnica Los Andes',
  'Escuela La Semilla',
  'Escuela Técnica Nehuen Peuman',
  'Escuela Woodville',
  'Instituto Dante Alighieri',
  'Instituto Primo Capraro',
  'Instituto Superior Patagónico',
  'Nuevo Colegio Suizo',
  'Otra',
]

const INTERESES = [
  'Programación competitiva',
  'Desarrollo web',
  'Inteligencia artificial',
  'Ciberseguridad',
  'Desarrollo de videojuegos',
  'Software libre y open source',
  'Robótica y hardware',
  'Proyectos con impacto social',
  'Dar talleres y enseñar',
]

const NIVELES_PROGRAMACION = [
  'Nunca programé',
  'Estoy empezando',
  'Resuelvo problemas por mi cuenta',
  'Tengo experiencia en proyectos reales',
]

export default function FormApp() {
  const [status, setStatus] = useState<Status>('idle')
  const [origen, setOrigen] = useState<Origen>('')
  const [otroOrigen, setOtroOrigen] = useState('')
  const [institucion, setInstitucion] = useState('')
  const [otraInstitucion, setOtraInstitucion] = useState('')
  const [intereses, setIntereses] = useState<string[]>([])
  const [otroInteres, setOtroInteres] = useState('')
  const { isMobile, isTablet } = useWindowSize()

  const padding = isMobile ? 'px-4 py-4' : isTablet ? 'px-5 py-5' : 'px-6 py-6'
  const bodyText = isMobile ? 'text-xs' : 'text-sm'
  const sectionTitle = 'text-sm'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)

    const payload = {
      nombre: data.get('nombre'),
      email: data.get('email'),
      origen_tipo: origen === 'otro' ? otroOrigen : origen,
      institucion: origen === 'otro' ? otraInstitucion : (institucion === 'Otra' ? otraInstitucion : institucion),
      nivel_programacion: data.get('nivel_programacion'),
      intereses: intereses.join(', '),
      interes_otro: otroInteres || null,
      motivacion: data.get('motivacion') || null,
    }

    try {
      const res = await fetch('/api/inscripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setStatus('sent')
        form.reset()
        setOrigen('')
        setOtroOrigen('')
        setInstitucion('')
        setOtraInstitucion('')
        setIntereses([])
        setOtroInteres('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClasses = `w-full rounded border border-border bg-surface-2 px-3 py-2 font-mono ${bodyText} text-text placeholder-muted/50 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30`

  const anim = (delay: number) => ({
    style: { animation: 'slide-in 220ms ease-out both', animationDelay: `${delay}ms` },
  })

  if (status === 'sent') {
    return (
      <div className={`flex h-full flex-col items-center justify-center gap-4 ${padding}`}>
        <div style={{ animation: 'count-pop 500ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
          <CheckCircle size={48} className="text-green" />
        </div>
        <p
          className={`font-mono font-bold text-green ${bodyText}`}
          style={{ animation: 'slide-up 300ms ease-out both', animationDelay: '120ms' }}
        >
          inscripción enviada
        </p>
        <p
          className="font-mono text-xs text-green"
          style={{ animation: 'slide-up 300ms ease-out both', animationDelay: '240ms' }}
        >
          $ sent → OK (200)
        </p>
      </div>
    )
  }

  return (
    <div className={`h-full overflow-auto ${padding}`}>
      <div className={`mx-auto max-w-2xl ${isMobile ? 'space-y-5' : 'space-y-6'}`}>

        {/* Header */}
        <div {...anim(0)}>
          <h2 className={`font-mono font-bold text-text ${isMobile ? 'text-lg' : 'text-2xl'}`}>
            Quiero ser parte!
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className={isMobile ? 'space-y-4' : 'space-y-5'}
        >
          {/* Nombre */}
          <div className="space-y-1" {...anim(60)}>
            <p className={`font-mono ${sectionTitle} text-accent`}># Nombre y apellido</p>
            <input
              name="nombre"
              type="text"
              required
              placeholder="ej: Jose Pérez"
              className={inputClasses}
            />
          </div>

          {/* Email */}
          <div className="space-y-1" {...anim(120)}>
            <p className={`font-mono ${sectionTitle} text-accent`}># Email</p>
            <input
              name="email"
              type="email"
              required
              placeholder="ej: josesitokapo2005@yahoo.com.ar"
              className={inputClasses}
            />
          </div>

          {/* Origen */}
          <div className="space-y-2" {...anim(180)}>
            <p className={`font-mono ${sectionTitle} text-accent`}># Venís de...</p>
            <select
              required
              value={origen}
              onChange={(e) => { setOrigen(e.target.value as Origen); setOtroOrigen(''); setInstitucion(''); setOtraInstitucion('') }}
              className={inputClasses}
            >
              <option value="" disabled>seleccioná una opción</option>
              <option value="universidad">Universidad / Instituto terciario</option>
              <option value="escuela">Escuela secundaria</option>
              <option value="otro">Otro</option>
            </select>
            {origen === 'otro' && (
              <input
                type="text"
                required
                value={otroOrigen}
                onChange={(e) => setOtroOrigen(e.target.value)}
                placeholder="¿de dónde venís?"
                className={inputClasses}
                style={{ animation: 'slide-up 200ms cubic-bezier(0.34,1.56,0.64,1) both' }}
              />
            )}
          </div>

          {/* Institución condicional */}
          {origen === 'universidad' && (
            <div className="space-y-2" style={{ animation: 'slide-up 200ms ease-out both' }}>
              <p className={`font-mono ${sectionTitle} text-accent`}># Institución</p>
              <select
                required
                value={institucion}
                onChange={(e) => { setInstitucion(e.target.value); setOtraInstitucion('') }}
                className={inputClasses}
              >
                <option value="" disabled>seleccioná tu universidad</option>
                {UNIVERSIDADES.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              {institucion === 'Otra' && (
                <input
                  type="text"
                  required
                  value={otraInstitucion}
                  onChange={(e) => setOtraInstitucion(e.target.value)}
                  placeholder="¿cuál?"
                  className={inputClasses}
                  style={{ animation: 'slide-up 200ms cubic-bezier(0.34,1.56,0.64,1) both' }}
                />
              )}
            </div>
          )}

          {origen === 'escuela' && (
            <div className="space-y-2" style={{ animation: 'slide-up 200ms ease-out both' }}>
              <p className={`font-mono ${sectionTitle} text-accent`}># Escuela</p>
              <select
                required
                value={institucion}
                onChange={(e) => { setInstitucion(e.target.value); setOtraInstitucion('') }}
                className={inputClasses}
              >
                <option value="" disabled>seleccioná tu escuela</option>
                {ESCUELAS.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
              {institucion === 'Otra' && (
                <input
                  type="text"
                  required
                  value={otraInstitucion}
                  onChange={(e) => setOtraInstitucion(e.target.value)}
                  placeholder="¿cuál?"
                  className={inputClasses}
                  style={{ animation: 'slide-up 200ms cubic-bezier(0.34,1.56,0.64,1) both' }}
                />
              )}
            </div>
          )}

          {origen === 'otro' && otroOrigen && (
            <div className="space-y-2" style={{ animation: 'slide-up 200ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <p className={`font-mono ${sectionTitle} text-accent`}># Institución</p>
              <input
                type="text"
                required
                value={otraInstitucion}
                onChange={(e) => setOtraInstitucion(e.target.value)}
                placeholder="ej: empresa, colegio, independiente..."
                className={inputClasses}
              />
            </div>
          )}

          {/* Nivel de programación */}
          <div className="space-y-1" {...anim(240)}>
            <p className={`font-mono ${sectionTitle} text-accent`}># ¿Sabés programar?</p>
            <select name="nivel_programacion" required className={inputClasses} defaultValue="">
              <option value="" disabled>seleccioná tu nivel</option>
              {NIVELES_PROGRAMACION.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Intereses */}
          <div className="space-y-2" {...anim(300)}>
            <p className={`font-mono ${sectionTitle} text-accent`}># ¿Qué te interesa? <span className="text-muted">(podés elegir varios)</span></p>
            <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {INTERESES.map((interes) => {
                const checked = intereses.includes(interes)
                return (
                  <label
                    key={interes}
                    className={`flex cursor-pointer items-center gap-2 rounded border px-3 py-2 font-mono ${bodyText} transition-all duration-150 ${checked
                      ? 'border-accent bg-accent/10 text-text'
                      : 'border-border text-muted hover:border-accent/50 hover:text-text'
                      }`}
                  >
                    <input
                      type="checkbox"
                      name="intereses"
                      value={interes}
                      checked={checked}
                      onChange={() =>
                        setIntereses((prev) =>
                          prev.includes(interes)
                            ? prev.filter((i) => i !== interes)
                            : [...prev, interes]
                        )
                      }
                      className="sr-only"
                    />
                    <span className={`shrink-0 transition-colors duration-150 ${checked ? 'text-accent' : 'text-muted'}`}>
                      {checked ? '■' : '□'}
                    </span>
                    {interes}
                  </label>
                )
              })}
              {/* Otro */}
              <label
                className={`flex cursor-pointer items-center gap-2 rounded border px-3 py-2 font-mono ${bodyText} transition-all duration-150 ${intereses.includes('otro')
                  ? 'border-accent bg-accent/10 text-text'
                  : 'border-border text-muted hover:border-accent/50 hover:text-text'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={intereses.includes('otro')}
                  onChange={() =>
                    setIntereses((prev) =>
                      prev.includes('otro')
                        ? prev.filter((i) => i !== 'otro')
                        : [...prev, 'otro']
                    )
                  }
                  className="sr-only"
                />
                <span className={`shrink-0 transition-colors duration-150 ${intereses.includes('otro') ? 'text-accent' : 'text-muted'}`}>
                  {intereses.includes('otro') ? '■' : '□'}
                </span>
                Otro
              </label>
            </div>

            {intereses.includes('otro') && (
              <input
                name="interes_otro"
                type="text"
                value={otroInteres}
                onChange={(e) => setOtroInteres(e.target.value)}
                placeholder="¿cuál?"
                className={inputClasses}
                style={{ animation: 'slide-up 180ms ease-out both' }}
              />
            )}
          </div>

          {/* Motivación */}
          <div className="space-y-1" {...anim(360)}>
            <p className={`font-mono ${sectionTitle} text-accent`}># ¿Por qué querés unirte? <span className="text-muted">(opcional)</span></p>
            <textarea
              name="motivacion"
              rows={isMobile ? 3 : 4}
              placeholder="ej: quiero aprender a programar y no sé por dónde empezar..."
              className={`${inputClasses} resize-none`}
            />
          </div>

          {/* Error */}
          {status === 'error' && (
            <div
              className="flex items-center gap-2 rounded border border-accent/50 bg-accent/5 px-3 py-2"
              style={{ animation: 'slide-up 250ms cubic-bezier(0.34,1.56,0.64,1) both' }}
            >
              <AlertCircle size={12} className="shrink-0 text-accent" style={{ animation: 'count-pop 400ms cubic-bezier(0.34,1.56,0.64,1) both' }} />
              <p className={`font-mono text-accent ${bodyText}`}>Error: intentá de nuevo</p>
            </div>
          )}

          {/* Submit */}
          <div {...anim(420)}>
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
          </div>
        </form>

      </div>
    </div>
  )
}
