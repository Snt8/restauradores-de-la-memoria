import { useNavegacionEnLista } from '@/shared/ui/useNavegacionEnLista.js'
import { Visor } from '@/shared/ui/Visor.jsx'
import { MiniaturaDeEvidencia } from './MiniaturaDeEvidencia.jsx'
import { VistaDeEvidencia } from './VistaDeEvidencia.jsx'

const COLUMNAS = {
  compacta: 'grid-cols-3 sm:grid-cols-4',
  amplia: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
}

/**
 * Cuadrícula de evidencias que se abren en un visor navegable.
 * @param detalleDe  texto opcional bajo el título de cada miniatura (p. ej. la sección)
 */
export function GaleriaDeEvidencias({ evidencias, densidad = 'compacta', detalleDe }) {
  const visor = useNavegacionEnLista(evidencias.length)
  const actual = visor.abierto ? evidencias[visor.indice] : null

  if (evidencias.length === 0) return null

  return (
    <>
      <ul className={`grid gap-2 ${COLUMNAS[densidad]}`}>
        {evidencias.map((evidencia, indice) => (
          <li key={evidencia.id}>
            <MiniaturaDeEvidencia
              evidencia={evidencia}
              detalle={detalleDe?.(evidencia)}
              onAbrir={() => visor.abrir(indice)}
            />
          </li>
        ))}
      </ul>
      <Visor
        abierto={visor.abierto}
        titulo={actual?.titulo}
        posicion={visor.posicion}
        onCerrar={visor.cerrar}
        onAnterior={visor.anterior}
        onSiguiente={visor.siguiente}
      >
        {actual && <VistaDeEvidencia evidencia={actual} />}
      </Visor>
    </>
  )
}
