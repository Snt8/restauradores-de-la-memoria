import { useQueryClient } from '@tanstack/react-query'
import { foro } from '@/shared/api/foro.js'
import { recursos } from '@/shared/api/recursos.js'
import { RUTAS } from './navegacion.js'

/**
 * Datos que pide cada página al abrirse, con las mismas claves de caché que usan sus
 * componentes. Precargarlos cuando el visitante apunta a un enlace hace que la página
 * aparezca ya con contenido, sin esqueletos de carga.
 */
const PRECARGAS = {
  [RUTAS.inicio]: () => [
    recursos.exposiciones.lista(),
    recursos.reconocimientos.lista(),
    foro.destacadas({ limite: 3 }),
  ],
  [RUTAS.queEs]: () => [recursos.actividades.lista({ tipo: 'formacion' })],
  [RUTAS.museo]: () => [recursos.objetos.lista(), recursos.exposiciones.lista()],
  [RUTAS.museoVirtual]: () => [recursos.objetos.lista(), recursos.exposiciones.lista()],
  [RUTAS.salidas]: () => [recursos.actividades.lista({ tipo: 'salida_pedagogica' })],
  [RUTAS.fechas]: () => [recursos.actividades.lista({ tipo: 'fecha_conmemorativa' })],
  [RUTAS.eventos]: () => [recursos.eventos.lista()],
  [RUTAS.reconocimientos]: () => [recursos.reconocimientos.lista()],
  [RUTAS.alianzas]: () => [recursos.aliados.lista()],
  [RUTAS.galeria]: () => [recursos.galeria.listaInfinita({}, 24)],
}

/**
 * @returns {(ruta: string) => object} props para un enlace (`onMouseEnter`, `onFocus`)
 *   que precargan los datos de la ruta. Respeta la caché: lo que está fresco no se repide.
 */
export function usePrecarga() {
  const queryClient = useQueryClient()

  return (ruta) => {
    const consultas = PRECARGAS[ruta]
    if (!consultas) return {}
    const precargar = () => {
      for (const opciones of consultas()) {
        if (opciones.getNextPageParam) queryClient.prefetchInfiniteQuery(opciones)
        else queryClient.prefetchQuery(opciones)
      }
    }
    return { onMouseEnter: precargar, onFocus: precargar }
  }
}
