# retUNRN – Club de Programación | Sitio Web Oficial

## Contexto del proyecto

Sitio web oficial del **Club de Programación retUNRN**, dependiente de la Escuela de
Producción y Tecnología de la **Universidad Nacional de Río Negro (UNRN)**,
Sede Andina, San Carlos de Bariloche, Argentina.

Aprobado por Resolución UNRN AND CDEyVE. Dominio: **https://www.retunrn.org**

---

## Concepto de diseño: retUNRN OS

El sitio simula un sistema operativo estilo Linux — escritorio con iconos, ventanas
arrastrables, barra de tareas, terminal funcional y secuencia de booteo animada.

Cada sección del sitio es una "app" que se abre como ventana:
- `quienes-somos.sh` → Quiénes somos
- `proyectos/`       → Proyectos GitHub
- `agenda.ics`       → Calendario de actividades
- `contacto.mail`    → Formulario para escuelas
- `github.lnk`       → Link al repositorio
- `terminal`         → Terminal interactiva

---

## Stack tecnológico

```
Vite 5          bundler, HMR instantáneo
React 18        UI y estado de ventanas
TypeScript      tipado estricto
Tailwind CSS 3  estilos, mobile-first
react-rnd       ventanas arrastrables y redimensionables
Zustand         estado global (ventanas abiertas, tema, terminal)
Lucide React    iconos — NO usar emojis en ningún componente
Formspree       formulario de contacto sin backend
```

Linter y formatter:
```
ESLint          con config @eslint/js + typescript-eslint + eslint-plugin-react-hooks
Prettier        con prettier-plugin-tailwindcss
```

Config mínima `.eslintrc.cjs`:
```js
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  rules: { 'no-console': 'warn' },
}
```

Config `.prettierrc`:
```json
{ "semi": false, "singleQuote": true, "tabWidth": 2, "plugins": ["prettier-plugin-tailwindcss"] }
```

---

## Estructura de archivos

```
retunrn-web/
├── public/
│   └── logo.png               ← COLOCAR AQUÍ EL LOGO
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── boot/
│   │   │   ├── BootSequence.tsx     ventana de booteo animada
│   │   │   └── bootLines.ts         array de líneas del boot log
│   │   ├── desktop/
│   │   │   ├── Desktop.tsx          fondo + iconos + ventanas activas
│   │   │   ├── DesktopIcon.tsx      ícono clickeable (Lucide + label)
│   │   │   └── Taskbar.tsx          barra inferior: hora, tema, apps abiertas
│   │   ├── window/
│   │   │   ├── Window.tsx           wrapper react-rnd con titlebar
│   │   │   └── WindowTitlebar.tsx   barra con título, minimizar, cerrar
│   │   ├── apps/
│   │   │   ├── WelcomeApp.tsx       pantalla de bienvenida centrada
│   │   │   ├── AboutApp.tsx         quiénes somos
│   │   │   ├── ProjectsApp.tsx      proyectos GitHub
│   │   │   ├── CalendarApp.tsx      calendario de actividades
│   │   │   ├── ContactApp.tsx       formulario para escuelas
│   │   │   └── TerminalApp.tsx      terminal con comandos
│   │   └── ui/
│   │       ├── ThemeToggle.tsx      toggle claro/oscuro
│   │       └── Clock.tsx            reloj en tiempo real
│   ├── store/
│   │   └── useDesktopStore.ts       Zustand: ventanas, tema, boot completado
│   ├── hooks/
│   │   └── useWindowSize.ts         responsive: detecta mobile/tablet
│   ├── styles/
│   │   └── global.css               variables CSS + reset
│   ├── constants/
│   │   └── apps.ts                  definición de apps: id, label, ícono, componente
│   ├── App.tsx                      root: boot → desktop
│   └── main.tsx
├── .eslintrc.cjs
├── .prettierrc
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── CLAUDE.md
```

---

## Dónde va el logo

```
1. Copiar logo.png a:  retunrn-web/public/logo.png
2. Usar en componentes: <img src="/logo.png" alt="retUNRN" className="h-8 w-auto" />
3. Favicon: convertir a favicon.ico (32x32) y colocar en public/
```

---

## Identidad visual

### Paleta de colores

El tema responde al sistema operativo por defecto. El usuario puede cambiarlo con el toggle.
`tailwind.config.ts` → `darkMode: 'class'`

**Dark mode** (default para desarrolladores):
```
--bg:        #0d0d0d   fondo del desktop
--surface:   #1a1a1a   ventanas, taskbar
--surface-2: #242424   titlebar, inputs
--border:    #2e2e2e   bordes de ventana
--text:      #e8e8e8   texto principal
--muted:     #999999   texto secundario
--accent:    #eb1f40   rojo retUNRN (extraído del logo)
--accent-h:  #ff3357   hover del acento
--green:     #00cc66   indicador online, prompt de terminal
```

**Light mode**:
```
--bg:        #e8e8e8
--surface:   #f5f5f5
--surface-2: #ffffff
--border:    #d0d0d0
--text:      #0d0d0d
--muted:     #555555
--accent:    #eb1f40   igual en ambos modos
--accent-h:  #c01535
--green:     #008844
```

Script anti-flash en `index.html` (antes del bundle):
```html
<script>
  const t = localStorage.getItem('theme')
  const d = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (t === 'dark' || (!t && d)) document.documentElement.classList.add('dark')
</script>
```

### Tipografía
```
JetBrains Mono  headings, terminal, labels de íconos, boot log
Inter           cuerpo de texto dentro de ventanas
```

Importar desde Google Fonts en `index.html`.

---

## Secuencia de booteo

Al entrar al sitio por primera vez (o si `bootCompleted === false` en Zustand), se muestra
`BootSequence` a pantalla completa antes del desktop.

### Comportamiento
1. Pantalla negra con el logo centrado pequeño
2. Aparecen líneas de boot log una por una (efecto typewriter, ~80ms entre líneas)
3. Barra de progreso que llega al 100%
4. Fade out → aparece el desktop con `WelcomeApp` abierta en el centro

### Líneas del boot log (`bootLines.ts`)
Mezcla de líneas técnicas reales y chistes de programadores. Ejemplos:
```ts
export const bootLines = [
  '[  0.000000] retUNRN OS v2026.1 — Bariloche kernel',
  '[  0.012438] Initializing UNRN Sede Andina hardware...',
  '[  0.089234] Loading competitive programming modules... ok',
  '[  0.143021] Mounting /dev/mates to /tmp/energía... ok',
  '[  0.201887] Starting git daemon... (esperando que alguien haga commit)',
  '[  0.334512] Checking if tests pass... just kidding, no hay tests',
  '[  0.445230] Compiling club enthusiasm: [██████████] 100%',
  '[  0.556891] Loading ICPC training data... ok',
  '[  0.678234] Warning: coffee level below threshold — proceeding anyway',
  '[  0.789001] Connecting to Instituto Balseiro over /dev/vecinos... ok',
  '[  0.901234] Spawning 6 coordinators in background... ok',
  '[  1.023456] retUNRN OS ready. Bienvenidx al club.',
]
```

Agregar más líneas para cubrir ~3 segundos de animación.

---

## Welcome screen (`WelcomeApp`)

Ventana centrada que se abre automáticamente al terminar el boot.
Contiene:
- Logo del club
- Texto: `// unrn sede andina · bariloche · patagonia · 2026`
- Título: `Club de Programación` + `retUNRN` con cursor parpadeante
- Prompt: `>>> aprender, competir y construir software con impacto social`
- Tres barras de progreso animadas: actividad / proyectos / miembros
- Dos botones: `Conocé el club` (abre AboutApp) y ícono GitHub (link externo)
- Footer de ventana: indicador online · UNRN Sede Andina · uptime contador

El cursor parpadeante es un `<span>` con animación CSS `blink` (opacity 0/1, 0.7s).
El uptime se calcula en JS desde que cargó la página.

---

## Terminal (`TerminalApp`)

Terminal interactiva dentro de una ventana. Estado en Zustand (`terminalHistory`).

### Prompt
```
user@retunrn:~$
```
Verde para el prompt, blanco para el output, rojo para errores.

### Comandos disponibles

| Comando | Output |
|---------|--------|
| `help` | Lista de comandos disponibles |
| `about` | Info del club en ASCII art simple |
| `whoami` | `estudiante de la UNRN` |
| `ls` | Lista las "apps" del desktop |
| `open <app>` | Abre una ventana (ej: `open proyectos`) |
| `clear` | Limpia el historial |
| `uname -a` | `retUNRN OS 2026.1 Bariloche #1 SMP GNU/Patagonia` |
| `uptime` | Tiempo desde que cargó la página |
| `git log` | Fake commit history gracioso del club |
| `sudo rm -rf /` | `Permiso denegado. Nice try.` |
| `exit` | `No podés salir. Ya sos parte del club.` |
| `ping balseiro.edu.ar` | Respuestas con latencia fake graciosa |
| `fortune` | Cita aleatoria de Dijkstra, Knuth, Torvalds, etc. |
| `neofetch` | Info del "sistema" estilo neofetch: OS, Club, Members, etc. |
| `coffee` | `Brewing... [████░░] Error: no hay más café` |

El historial se navega con flechas ↑↓. Tab autocompleta comandos.

---

## Ventanas (`Window.tsx`)

Wrapper sobre `react-rnd` con comportamiento estándar de OS.

### Props
```ts
interface WindowProps {
  id: string
  title: string
  icon: LucideIcon
  children: React.ReactNode
  defaultPosition?: { x: number; y: number }
  defaultSize?: { width: number; height: number }
}
```

### Comportamiento
- Titlebar: ícono + título + botones minimizar/cerrar (Lucide: `Minus`, `X`)
- Click en titlebar trae la ventana al frente (`zIndex` manejado en Zustand)
- Cerrar → elimina del array de ventanas abiertas en Zustand
- Minimizar → oculta la ventana pero mantiene el botón en la taskbar
- En mobile/tablet: ventana ocupa pantalla completa, sin drag (ver sección responsive)

---

## Responsive / Mobile

El sitio debe funcionar bien en celular y tablet. Usar el hook `useWindowSize`.

### Breakpoints
```
mobile:  < 768px   — ventanas a pantalla completa, sin drag, sin resize
tablet:  768–1024px — ventanas con tamaño fijo centrado, drag deshabilitado
desktop: > 1024px  — comportamiento completo con react-rnd
```

### Adaptaciones en mobile
- Ventanas: `position: fixed`, `inset: 0`, sin react-rnd
- Taskbar: bottom bar con iconos de las apps activas
- Iconos del desktop: grid 3 columnas, tap para abrir
- Terminal: teclado virtual del dispositivo, scroll automático al input
- Boot sequence: igual en todos los tamaños

En `Window.tsx`:
```tsx
const { isMobile } = useWindowSize()
if (isMobile) return <MobileWindow ...>{children}</MobileWindow>
return <Rnd ...>{children}</Rnd>
```

---

## Animaciones

Usar `transition` y `@keyframes` CSS. No usar librerías de animación externas.
Respetar `prefers-reduced-motion` en todas las animaciones:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

### Catálogo de animaciones
```css
/* Cursor parpadeante en WelcomeApp */
@keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }

/* Aparición de ventana */
@keyframes window-open { from { opacity: 0; scale: 0.95 } to { opacity: 1; scale: 1 } }

/* Líneas del boot log */
@keyframes slide-in { from { opacity: 0; translateX(-8px) } to { opacity: 1; translateX(0) } }

/* Barra de progreso (WelcomeApp y boot) */
@keyframes progress { from { width: 0% } to { width: var(--target-width) } }

/* Fade del boot al desktop */
@keyframes fade-out { to { opacity: 0; pointer-events: none } }
```

Tiempos:
- Boot log: 80ms entre líneas, 120ms para la animación de cada línea
- Apertura de ventana: 150ms ease-out
- Fade boot→desktop: 400ms ease-in
- Cursor blink: 700ms

---

## Zustand store (`useDesktopStore.ts`)

```ts
interface DesktopStore {
  bootCompleted: boolean
  setBootCompleted: () => void

  theme: 'dark' | 'light'
  toggleTheme: () => void

  windows: WindowState[]        // ventanas abiertas
  openWindow: (id: AppId) => void
  closeWindow: (id: AppId) => void
  minimizeWindow: (id: AppId) => void
  focusWindow: (id: AppId) => void
  topZIndex: number

  terminalHistory: TerminalLine[]
  pushTerminalLine: (line: TerminalLine) => void
  clearTerminal: () => void
}
```

---

## Definición de apps (`constants/apps.ts`)

```ts
import { User, FolderGit2, Calendar, Mail, Github, Terminal } from 'lucide-react'

export const APPS = [
  { id: 'about',    label: 'quienes-somos.sh', icon: User,       component: AboutApp },
  { id: 'projects', label: 'proyectos/',        icon: FolderGit2, component: ProjectsApp },
  { id: 'calendar', label: 'agenda.ics',        icon: Calendar,   component: CalendarApp },
  { id: 'contact',  label: 'contacto.mail',     icon: Mail,       component: ContactApp },
  { id: 'github',   label: 'github.lnk',        icon: Github,     component: null },  // abre link externo
  { id: 'terminal', label: 'terminal',           icon: Terminal,   component: TerminalApp },
] as const
```

---

## Contenido institucional

### Misión
> El Club de Programación retUNRN es un espacio extracurricular, inclusivo y colaborativo
> que busca promover vocaciones tecnológicas y STEM, fortalecer competencias en
> programación, impulsar proyectos de software libre con impacto social y reducir
> brechas de acceso mediante alfabetización digital.

### Equipo
- Mauricio Boyé — Coordinador general / Presidente
- Matías Cajal — Coordinador / Secretario
- Celso Brizuela — Coordinador / Tesorero
- Ezequiel Navone — Coordinador
- Fernando Giménez — Coordinador
- Paola Britos — Coordinadora directora UNRN

### Links
- Web: https://www.retunrn.org
- GitHub: https://github.com/retunrn
- Sede: Anasagasti 1463, R8400, San Carlos de Bariloche, Río Negro

---

## Convenciones de código

- TypeScript estricto — no usar `any`
- Componentes: PascalCase, un componente por archivo
- Hooks: `use` prefix, en `/hooks`
- Constantes: SCREAMING_SNAKE_CASE en `/constants`
- Commits en español: `feat: agrega terminal con comando neofetch`
- Comentarios solo cuando explican el **por qué**, no el qué
- Lucide icons siempre — cero emojis en JSX

---

## Comandos

```bash
npm run dev      # localhost:5173
npm run build    # /dist listo para subir a Hostinger
npm run preview  # preview del build
npm run lint     # ESLint
npm run format   # Prettier
```

## Deploy en Hostinger

1. `npm run build` → genera `/dist`
2. Subir contenido de `/dist` a `public_html` en Hostinger
3. Agregar `_redirects` o configurar en Hostinger para SPA (todo a `index.html`)

---

## Implementación de la pantalla de booteo

### Flujo en `App.tsx`

```tsx
export default function App() {
  const bootCompleted = useDesktopStore(s => s.bootCompleted)
  return bootCompleted ? <Desktop /> : <BootSequence />
}
```

### `BootSequence.tsx`

Tres fases internas manejadas con estado local (`phase: 'logo' | 'log' | 'progress' | 'done'`):

**Fase 1 — logo** (800ms)
- Pantalla negra, logo + versión hacen fade-in
- No necesita Zustand, es estado local del componente

**Fase 2 — log** (una línea cada 80–90ms)
- Itera `bootLines` con `setTimeout` recursivo
- Cada línea nueva hace scroll automático: `ref.current.scrollTop = ref.current.scrollHeight`
- `useEffect` cleanup cancela el timeout si el componente desmonta

**Fase 3 — progress** (100 pasos × 28ms = ~2.8s)
- `setInterval` incrementa de 0 a 100
- `pct` se muestra en el label, `width` en la barra

**Transición al desktop** (400ms fade-out)
- Al llegar al 100%: `setTimeout` de 400ms, luego `setBootCompleted()` en Zustand
- CSS transition en el wrapper: `transition: opacity 0.5s ease`

```tsx
// limpieza correcta de timers
useEffect(() => {
  const id = setTimeout(nextLine, delay)
  return () => clearTimeout(id)
}, [phase, lineIndex])
```

### Estilos del boot log

Cada línea tiene clases para colorear partes del texto:
```tsx
// en bootLines.ts — usar spans con className dentro del mensaje
{ ts: '[  0.512000]', msg: 'WARNING: coffee level...', type: 'warn' }

// en BootSequence.tsx
<span className="text-yellow-500">{line.ts}</span>
<span className={typeClass(line.type)}>{line.msg}</span>
```

Clases Tailwind por tipo:
```ts
const typeClass = (type: string) => ({
  ok:   'text-green-400',
  warn: 'text-yellow-500',
  err:  'text-red-500',
  info: 'text-zinc-200',
}[type] ?? 'text-zinc-200')
```

### `bootLines.ts` — lista completa

```ts
export type BootLine = { ts: string; msg: string; type: 'ok' | 'warn' | 'err' | 'info' }

export const bootLines: BootLine[] = [
  { ts: '[  0.000000]', msg: 'retUNRN OS v2026.1 — Bariloche kernel',              type: 'info' },
  { ts: '[  0.012438]', msg: 'Initializing UNRN Sede Andina hardware...',           type: 'info' },
  { ts: '[  0.089234]', msg: 'Loading competitive programming modules... ok',        type: 'ok'   },
  { ts: '[  0.143021]', msg: 'Mounting /dev/mates on /tmp/energía... ok',            type: 'ok'   },
  { ts: '[  0.201887]', msg: 'Starting git daemon... (esperando que alguien haga commit)', type: 'info' },
  { ts: '[  0.298456]', msg: 'Checking if tests pass... just kidding, no hay tests', type: 'warn' },
  { ts: '[  0.334512]', msg: 'Compiling club enthusiasm: [██████████] 100%',         type: 'ok'   },
  { ts: '[  0.445230]', msg: 'Loading ICPC training data... ok',                     type: 'ok'   },
  { ts: '[  0.512000]', msg: 'WARNING: coffee level below threshold — proceeding anyway', type: 'warn' },
  { ts: '[  0.556891]', msg: 'Connecting to Instituto Balseiro over /dev/vecinos... ok', type: 'ok' },
  { ts: '[  0.623445]', msg: 'Loading algoritmia modules... ok',                     type: 'ok'   },
  { ts: '[  0.701234]', msg: 'sudo chmod +x estudiantes.sh — ok',                   type: 'ok'   },
  { ts: '[  0.789001]', msg: 'Spawning 6 coordinators in background... ok',          type: 'ok'   },
  { ts: '[  0.856234]', msg: 'git push origin main... nothing to commit (for now)',  type: 'warn' },
  { ts: '[  0.901234]', msg: 'Starting discord-daemon... ok',                        type: 'ok'   },
  { ts: '[  0.967000]', msg: 'Iniciando modo Patagonia: temperatura = -3°C, mate = caliente', type: 'info' },
  { ts: '[  1.023456]', msg: 'retUNRN OS ready. Bienvenidx al club.',               type: 'ok'   },
]
```

### Tiempos exactos

```ts
const DELAYS = {
  logoFadeIn:    800,   // espera antes de empezar el log
  lineInterval:   85,   // ms entre líneas (primeras 3: 60ms, resto: 85-90ms)
  progressStep:   28,   // ms por cada 1% de la barra (100 pasos = ~2.8s)
  fadeOut:       400,   // duración del fade antes de mostrar el desktop
}
```

### `prefers-reduced-motion`

```css
/* en global.css — reduce todo a instantáneo */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

En React, también saltar directamente al desktop si el usuario prefiere menos movimiento:
```tsx
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReduced) { setBootCompleted(); return }
```
