export default function FormApp() {
  return (
    <div className="h-full overflow-auto px-6 py-6">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-mono text-2xl font-bold text-text">Quiero ser parte!</h2>

        <div className="mt-5 space-y-2 rounded-lg border border-border bg-surface-2 px-4 py-4">
          <p className="font-mono text-xs text-muted">$ cat inscripcion.sh</p>
          <p className="font-mono text-xs text-accent">TODO: formulario próximamente</p>
          <p className="font-mono text-xs text-muted"># por ahora escribinos a:</p>
          <a
            href="mailto:info@retunrn.org"
            className="font-mono text-sm text-green hover:underline"
          >
            info@retunrn.org
          </a>
        </div>

        <div className="mt-5 select-none space-y-2 opacity-40 pointer-events-none">
          {['nombre y apellido', 'email', 'carrera / institución'].map((f) => (
            <div key={f} className="rounded-lg border border-border px-3 py-2.5">
              <span className="font-mono text-xs text-muted">{f}</span>
            </div>
          ))}
          <div className="rounded-lg border border-border bg-accent/5 px-3 py-2.5 text-center">
            <span className="font-mono text-xs text-muted">enviar → (próximamente)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
