import { TarjetaDeContenido } from '@/entities/contenido/TarjetaDeContenido.jsx'
import { EnEstaPagina } from '@/shared/ui/EnEstaPagina.jsx'
import { Seccion } from '@/shared/ui/Seccion.jsx'
import { idDeAnio, nombreDeAnio } from './salidas.js'

/** Muro de salidas pedagógicas, una sección por año. `grupos` viene de useSalidasPorAnio. */
export function SalidasPorAnio({ grupos }) {
  return grupos.map(([anio, salidas]) => (
    <Seccion
      key={anio ?? 'sin-fecha'}
      id={idDeAnio(anio)}
      titulo={nombreDeAnio(anio)}
      variante="abierta"
    >
      <ul className="space-y-4">
        {salidas.map((salida) => (
          <li key={salida.id}>
            <TarjetaDeContenido
              titulo={salida.nombre}
              fecha={salida.fecha}
              lugar={salida.lugar}
              descripcion={salida.descripcion}
              evidencias={salida.evidencias}
            />
          </li>
        ))}
      </ul>
    </Seccion>
  ))
}

/** Índice del panel: salta a cada año y dice cuántas salidas tiene. */
export function IndiceDeAnios({ grupos }) {
  return (
    <EnEstaPagina
      titulo="Por año"
      secciones={grupos.map(([anio, salidas]) => ({
        id: idDeAnio(anio),
        etiqueta: nombreDeAnio(anio),
        detalle: salidas.length === 1 ? '1 salida' : `${salidas.length} salidas`,
      }))}
    />
  )
}
