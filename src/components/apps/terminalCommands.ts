const PAGE_LOAD = Date.now()

const GIT_LOG = [
  'commit a3f9c12  Cambios',
  'commit b7e2d45  Cambios de cambios',
  'commit c1a8f33  Modificaciones de los cambios de los cambios',
  'commit d4b6e21  Revertir los cambios de los cambios pero mantener modificaciones',
  'commit e9c3a17  Cambios en las modificaciones de los cambios',
  'commit f2d7b09  Refactor de 0',
]

// ─── Agregá comandos acá ──────────────────────────────────────────────────────
// Cada comando recibe args: string[] y retorna string | string[]
// Para comandos con side-effects (open, clear) usá el objeto SPECIAL_COMMANDS en TerminalApp.tsx

export const COMMANDS: Record<string, (args: string[]) => string | string[]> = {
  help: () => [
    'Comandos disponibles:',
    '  help          esta ayuda',
    '  whoami        quién sos',
    '  ls            apps disponibles',
    '  open <app>    abre una ventana',
    '  uname -a      info del sistema',
    '  uptime        tiempo desde que cargó la página',
    '  git log       historial de commits',
    '  fortune       sabiduría aleatoria',
    '  neofetch      info del sistema estilo neofetch',
    '  cowsay <msg>  lo que dice la vaca',
    '  coffee        cafeína',
    '  sudo rm -rf / no lo intentes',
    '  clear         limpia la terminal',
    '  exit          fijate',
  ],

  whoami: () => 'Una maquina de la programación',

  ls: () => [
    'inicio  quienes-somos  inscripcion  proyectos  agenda  contacto  terminal',
  ],

  'uname -a': () =>
    'retUNRN OS v67.69.67',

  uname: (args) =>
    args.includes('-a')
      ? 'retUNRN OS v67.69.67'
      : 'retUNRN',

  uptime: () => {
    const s = Math.floor((Date.now() - PAGE_LOAD) / 1000)
    const m = Math.floor(s / 60)
    const h = Math.floor(m / 60)
    const parts = []
    if (h > 0) parts.push(`${h}h`)
    if (m % 60 > 0) parts.push(`${m % 60}m`)
    parts.push(`${s % 60}s`)
    return `up ${parts.join(' ')} — sin crashear (por ahora)`
  },

  'git log': () => GIT_LOG,

  git: (args) =>
    args[0] === 'log'
      ? GIT_LOG
      : 'git: comando no reconocido. probá `git log`',

  'sudo rm -rf /': () => 'Que querés borrar?',

  sudo: () => 'No flashees confianza',

  neofetch: (args) => {
    const theme = args[0] === 'light' ? 'Light' : 'Dark'
    const s = Math.floor((Date.now() - PAGE_LOAD) / 1000)
    const m = Math.floor(s / 60)
    const h = Math.floor(m / 60)
    const parts: string[] = []
    if (h > 0) parts.push(`${h}h`)
    if (m % 60 > 0) parts.push(`${m % 60}m`)
    parts.push(`${s % 60}s`)
    const uptime = parts.join(' ')

    const W = 36
    const logo = [
      `▖            ▐  ▌ ▌▙ ▌▛▀▖▙ ▌`,
      `▝▚▖    ▙▀▖▞▀▖▜▀ ▌ ▌▌▌▌▙▄▘▌▌▌▐▌`,
      `▞▘     ▌  ▛▀ ▐ ▖▌ ▌▌▝▌▌▚ ▌▝▌▗▖`,
      `  ▀▀▀  ▘  ▝▀▘ ▀ ▝▀ ▘ ▘▘ ▘▘ ▘▗▘`,
    ]
    const header = 'user@retunrn'
    const sep = '-'.repeat(header.length)
    const info = [
      header,
      sep,
      `OS: retUNRN OS v67.69.67`,
      `Uptime: ${uptime}`,
    ]

    const lines = logo.map((l, i) => l.padEnd(W) + (info[i] ?? ''))
    lines.push(`${''.padEnd(W)}Shell: ni idea pa`)
    lines.push(`${''.padEnd(W)}Theme: ${theme}`)
    lines.push(`${''.padEnd(W)}Lang: C, Python, JavaScript`)
    lines.push(`${''.padEnd(W)}Sede: UNRN Andina · Bariloche`)
    return lines
  },

  coffee: () => [
    'Brewing... [████████░░]',
    'Error: no hay más café',
    'hint: intentá con mate',
  ],

  exit: () => 'No podés salir. Ya sos parte del club.',

  cowsay: (args) => {
    const msg = args.join(' ') || 'Moo!'
    const line = '-'.repeat(msg.length + 2)
    return [
      ` ${line}`,
      `< ${msg} >`,
      ` ${line}`,
      '        \\   ^__^',
      '         \\  (oo)\\_______',
      '            (__)\\       )\\/\\',
      '                ||----w |',
      '                ||     ||',
    ]
  },
}
// ─────────────────────────────────────────────────────────────────────────────
