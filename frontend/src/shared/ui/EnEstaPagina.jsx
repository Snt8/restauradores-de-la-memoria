import { useSeccionActiva } from '@/shared/lib/useSeccionActiva.js'
import { TarjetaPanel } from './TarjetaPanel.jsx'

/**
 * Índice de la página en el panel derecho: salta a cada sección y resalta la que se está
 * leyendo. Se queda fijo al desplazarse, así el lector siempre sabe dónde está. Solo
 * aparece cuando el panel es una columna: en móvil quedaría al final de la página.
 *
 * @param secciones  [{ id, etiqueta, detalle? }]
 */
export function EnEstaPagina({ secciones, titulo = 'En esta página' }) {
  const activa = useSeccionActiva(secciones.map((seccion) => seccion.id))

  return (
    <TarjetaPanel titulo={titulo} fija soloEnColumna>
      <nav aria-label={titulo}>
        <ol className="-mx-2 space-y-0.5 text-sm">
          {secciones.map((seccion) => {
            const actual = seccion.id === activa
            return (
              <li key={seccion.id}>
                <a
                  href={`#${seccion.id}`}
                  aria-current={actual ? 'location' : undefined}
                  className={`flex items-baseline justify-between gap-3 rounded-lg border-l-2 px-3 py-2 transition-colors ${
                    actual
                      ? 'border-memoria bg-memoria/10 font-semibold text-memoria-hondo'
                      : 'border-transparent text-tinta-suave hover:bg-tinta/5 hover:text-tinta'
                  }`}
                >
                  <span>{seccion.etiqueta}</span>
                  {seccion.detalle !== undefined && (
                    <span className="text-xs text-tinta-suave tabular-nums">{seccion.detalle}</span>
                  )}
                </a>
              </li>
            )
          })}
        </ol>
      </nav>
    </TarjetaPanel>
  )
}
