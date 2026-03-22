# retUNRN Web · Club de Programación

Sitio web oficial del Club de Programación retUNRN — UNRN Sede Andina, Bariloche.
Diseño estilo **Linux OS** con ventanas arrastrables, terminal funcional y booteo animado.

## Stack

- **React 18** + **TypeScript** — UI y estado
- **Vite 5** — Bundler con HMR instantáneo
- **Tailwind CSS 3** — Estilos
- **Zustand** — Estado global (ventanas, tema, terminal)
- **react-rnd** — Ventanas arrastrables
- **Lucide React** — Iconos

## Empezar

```bash
npm install
npm run dev       # localhost:5173
```

## Comandos

```bash
npm run dev       # desarrollo con HMR
npm run build     # generar /dist para producción
npm run preview   # previsualizar build
npm run lint      # ESLint
npm run format    # Prettier
```

## Estructura

```
src/
├── components/
│   ├── boot/        BootSequence, boot log animado
│   ├── desktop/     Desktop, iconos, taskbar
│   ├── window/      Window con titlebar arrastrables
│   ├── apps/        AboutApp, ProjectsApp, TerminalApp, etc.
│   └── ui/          ThemeToggle, Clock
├── store/          Zustand: ventanas, tema, terminal
├── hooks/          useWindowSize (responsive)
├── constants/      apps.ts con definición de apps
└── styles/         global.css
```

## Desarrollo

1. **Apps nuevas**: Crear componente en `src/components/apps/`, agregarlo a `src/constants/apps.ts`
2. **Estilos**: Tailwind CSS — no crear archivos CSS nuevos
3. **Estado global**: Zustand en `src/store/useDesktopStore.ts`
4. **Terminal**: Comandos en `src/components/apps/TerminalApp.tsx`

## Pendiente antes del lanzamiento

### Logo y favicon

- Copiar el logo oficial a `public/logo.png`
- El logo aparece en la pantalla splash del boot
- Generar favicon y colocarlo en `public/favicon.svg`

### Formulario de contacto — Formspree

1. Crear cuenta en [formspree.io](https://formspree.io) y registrar el formulario
2. Reemplazar el ID en `src/components/apps/ContactApp.tsx`:

```ts
// buscar esta línea y reemplazar REEMPLAZAR_ID con el ID real:
fetch('https://formspree.io/f/REEMPLAZAR_ID', ...)
```

### Link de Discord

1. Crear el servidor de Discord del club y obtener el invite link
2. Reemplazar `PENDIENTE` en dos archivos:
   - `src/components/desktop/Taskbar.tsx`
   - `src/components/desktop/MobileDesktop.tsx`

```ts
// buscar y reemplazar:
href="https://discord.gg/PENDIENTE"
```

### Proyectos reales

Editar el array `REPOS` en `src/components/apps/ProjectsApp.tsx`:

```ts
const REPOS: Repo[] = [
  {
    name: 'nombre-del-repo',
    description: 'Descripción corta del proyecto',
    langs: ['TypeScript', 'React'],  // uno o más lenguajes
    url: 'https://github.com/ret-unrn/nombre-del-repo',
  },
]
```

Lenguajes con color disponibles: `TypeScript`, `React`, `C++`, `Python`, `JavaScript`,
`Go`, `Rust`, `Java`, `Shell`, `Markdown`. Para agregar uno nuevo, editar `LANG_COLORS`
en el mismo archivo.

### Eventos del calendario

Editar el array `EVENTS` en `src/components/apps/CalendarApp.tsx`:

```ts
const EVENTS: CalendarEvent[] = [
  {
    date: 'YYYY-MM-DD',   // formato ISO
    title: 'Nombre del evento',
    time: '18:00',        // opcional
    url: 'https://...',   // opcional, abre link de más info
  },
]
```

📖 Ver **CLAUDE.md** para detalles de arquitectura, animaciones y diseño del OS.
