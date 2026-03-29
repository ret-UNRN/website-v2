# retUNRN · Sitio Web

Sitio oficial del Club de Programación retUNRN — UNRN Sede Andina, Bariloche.
Simula un sistema operativo Linux: ventanas arrastrables, terminal funcional y secuencia de booteo animada.

🌐 [retunrn.org](https://www.retunrn.org) · 🐙 [github.com/ret-unrn](https://github.com/ret-unrn)

---

## Inicio rápido

```bash
git clone https://github.com/ret-unrn/website
cd website
npm install
cp .env.example .env.local   # completar variables
npx vercel dev               # localhost:3000
```

### Variables de entorno

```env
STORAGE_DATABASE_URL=        # Neon — connection string (pooled)
RESEND_API_KEY=              # Resend — mails de confirmación y contacto
```

---

## Stack

| | |
|---|---|
| React 19 + TypeScript | UI y estado |
| Vite 8 | Bundler |
| Tailwind CSS 4 | Estilos |
| Zustand | Estado global (ventanas, tema, terminal) |
| react-rnd | Ventanas arrastrables |
| Neon (serverless) | Base de datos — inscripciones |
| Resend | Envío de mails |
| Vercel | Deploy y serverless functions |

---

## Estructura

```
src/
├── components/
│   ├── boot/        Secuencia de arranque animada
│   ├── desktop/     Desktop, iconos, taskbar, MobileDesktop
│   ├── window/      Wrapper react-rnd con titlebar
│   ├── apps/        Una app por ventana (About, Projects, Form, etc.)
│   └── ui/          ThemeToggle, Clock, DiscordIcon
├── store/           Zustand: ventanas, tema, terminal
├── hooks/           useWindowSize
├── constants/       Definición de apps (id, label, ícono, componente)
└── styles/          global.css — variables CSS y animaciones

api/
├── inscripcion.ts         POST — guarda inscripción en Neon + manda mail
├── inscripciones-count.ts GET  — cuenta de inscriptos
└── contact.ts             POST — manda mail a info@retunrn.org via Resend
```

---

## Comandos

```bash
npm run dev       # desarrollo con HMR (sin API — usar vercel dev para eso)
npm run build     # build de producción
npm run preview   # previsualizar build
npm run lint      # ESLint
npm run format    # Prettier
npx vercel dev    # desarrollo completo con serverless functions
```

---

## Flujo de trabajo (Git Flow)

Usamos Git Flow. Las ramas principales son `main` (producción) y `develop` (integración).

```bash
# Nueva funcionalidad
git checkout develop
git checkout -b feature/nombre-de-la-feature
# ... trabajar ...
git push origin feature/nombre-de-la-feature
# Abrir PR hacia develop

# Fix urgente en producción
git checkout main
git checkout -b hotfix/descripcion
# ... fix ...
# PR hacia main Y hacia develop
```

- `main` — siempre deployable, solo recibe merges desde `develop` o `hotfix/*`
- `develop` — rama de integración, acá se juntan las features
- `feature/*` — una rama por funcionalidad, sale de `develop`
- `hotfix/*` — fix urgente sobre `main`

Los commits van en español y siguen el formato:

```
feat: agrega comando fortune a la terminal
fix: corrige scroll en TerminalApp en mobile
chore: actualiza dependencias
```

---

## Agregar contenido

**Nueva app/ventana** — crear componente en `src/components/apps/` y registrarlo en `src/constants/apps.ts`.

**Proyectos** — editar el array `REPOS` en `src/components/apps/ProjectsApp.tsx`.

**Eventos del calendario** — editar el array `EVENTS` en `src/components/apps/CalendarApp.tsx`:

```ts
{ date: 'YYYY-MM-DD', title: 'Nombre', time: '18:00', url: 'https://...' }
```

**Comandos de la terminal** — agregar casos en `src/components/apps/TerminalApp.tsx`.

**Link de Discord** — reemplazar `PENDIENTE` en `Taskbar.tsx` y `MobileDesktop.tsx`.

---

## DB — schema

```sql
CREATE TABLE IF NOT EXISTS inscripciones (
  id                 SERIAL PRIMARY KEY,
  nombre             VARCHAR(255) NOT NULL,
  email              VARCHAR(255) NOT NULL,
  origen_tipo        VARCHAR(50)  NOT NULL,
  institucion        VARCHAR(255) NOT NULL,
  nivel_programacion VARCHAR(100) NOT NULL,
  intereses          TEXT,
  interes_otro       VARCHAR(255),
  motivacion         TEXT,
  created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Correr una vez en el panel de Neon o con `psql`. El archivo está en `api/schema.sql`.

---

Ver `CLAUDE.md` para detalles de arquitectura, animaciones y sistema de diseño.

---

## Flujo con Claude Code

Este proyecto se desarrolló usando [Claude Code](https://claude.ai/claude-code) como asistente de desarrollo en la terminal.

La dinámica fue conversacional: describir qué se quería construir, revisar los cambios propuestos, aprobar o corregir, y continuar. Claude lee el código existente antes de tocar algo, por lo que el contexto se mantiene entre tareas.

Lo que funcionó bien:

- Tareas acotadas y concretas ("agregar animación cuando llega el dato", "crear endpoint GET que devuelva el count")
- Correcciones directas ("eso no, hacelo así")
- Iterar rápido sobre UI — propone, se ve, se ajusta

Lo que hay que tener en cuenta:

- Siempre revisar los cambios antes de aprobar, especialmente en archivos críticos
- Para decisiones de arquitectura conviene discutir antes de que empiece a escribir
- El `CLAUDE.md` es clave — tiene las convenciones del proyecto y Claude lo respeta

Para trabajar en este repo con Claude Code:

```bash
npm install -g @anthropic-ai/claude-code
cd website
claude
```
