/** Marcador de carga con la forma aproximada de una cuadrícula de tarjetas. */
export function Esqueleto({ tarjetas = 3 }) {
  return (
    <div role="status" aria-live="polite" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <span className="sr-only">Cargando contenido…</span>
      {Array.from({ length: tarjetas }, (_, i) => (
        <div key={i} aria-hidden="true" className="animate-pulse rounded-tarjeta bg-white p-4">
          <div className="aspect-[4/3] rounded-lg bg-papel-hondo" />
          <div className="mt-4 h-4 w-2/3 rounded bg-papel-hondo" />
          <div className="mt-2 h-3 w-1/2 rounded bg-papel-hondo" />
        </div>
      ))}
    </div>
  )
}
