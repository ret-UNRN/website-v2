export type BootLine = {
  ts: string
  msg: string
  type: 'ok' | 'warn' | 'err' | 'info'
}

export const bootLines: BootLine[] = [
  {
    ts: '[  0.000000]',
    msg: 'retUNRN OS v67.69.67 — kernel del club iniciando',
    type: 'info',
  },
  {
    ts: '[  0.012438]',
    msg: 'Detectando hardware disponible... (sí, esa compu vieja también sirve)',
    type: 'info',
  },
  {
    ts: '[  0.089234]',
    msg: 'Cargando módulos de programación competitiva... ok',
    type: 'ok',
  },
  {
    ts: '[  0.143021]',
    msg: 'Montando /dev/null en /tmp/documentación... ok',
    type: 'ok',
  },
  {
    ts: '[  0.201887]',
    msg: 'Resolviendo dependencias... ok (solo 247 paquetes, tranqui)',
    type: 'info',
  },
  {
    ts: '[  0.298456]',
    msg: 'Buscando tests... ADVERTENCIA: no hay tests, probamos a mano',
    type: 'warn',
  },
  {
    ts: '[  0.334512]',
    msg: 'Compilando entusiasmo del club: [██████████] 100%... ok',
    type: 'ok',
  },
  {
    ts: '[  0.445230]',
    msg: 'Cargando Codeforces en 17 pestañas distintas... ok',
    type: 'ok',
  },
  {
    ts: '[  0.512000]',
    msg: 'ADVERTENCIA: nivel de mate por debajo del mínimo — continuando igual',
    type: 'warn',
  },
  {
    ts: '[  0.556891]',
    msg: 'Ping 192.168.1.1... ok (tiempo de respuesta: más rápido que el WiFi de la uni)',
    type: 'ok',
  },
  {
    ts: '[  0.623445]',
    msg: 'Cargando biblioteca de algoritmos que "igual los entendemos después"... ok',
    type: 'ok',
  },
  {
    ts: '[  0.701234]',
    msg: 'sudo chmod +x estudiantes.sh — ok (ahora sí pueden hacer cosas, ponele)',
    type: 'ok',
  },
  {
    ts: '[  0.789001]',
    msg: 'Spawnando coordinadores en background... ok (algunos están boludeando, pero bueno)',
    type: 'ok',
  },
  {
    ts: '[  0.856234]',
    msg: 'Liberando memoria... ok (3 segfaults suprimidos por salud mental)',
    type: 'warn',
  },
  {
    ts: '[  0.901234]',
    msg: 'Iniciando discord-daemon... ok (canal #random ya está fuera de control)',
    type: 'ok',
  },
  {
    ts: '[  0.967000]',
    msg: 'Stack de tareas pendientes: overflow. Continuando igual',
    type: 'warn',
  },
  {
    ts: '[  1.023456]',
    msg: 'retUNRN OS listo. Bienvenidx al club.',
    type: 'ok',
  },
]
