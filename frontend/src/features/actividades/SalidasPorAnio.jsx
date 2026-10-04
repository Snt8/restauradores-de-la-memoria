import { useQuery } from '@tanstack/react-query'
import { TarjetaDeContenido } from '@/entities/contenido/TarjetaDeContenido.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { agruparPor } from '@/shared/lib/agrupar.js'
import { TEXTO_FECHA_POR_CONFIRMAR } from '@/shared/lib/fechas.js'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'

/** Línea de tiempo de salidas pedagógicas agrupadas por año; las que no tienen año, al final. */
export function SalidasPorAnio() {
  const consulta = useQuery(recursos.actividades.lista({ tipo: 'salida_pedagogica' }))

  return (
    <EstadoDeConsulta consulta={consulta}>
      {({ elementos }) => (
        <div className="space-y-12">
          {agruparPor(elementos, (salida) => salida.fecha.anio).map(([anio, salidas]) => (
            <section key={anio ?? 'sin-fecha'}>
              <h2 className="mb-6 flex items-center gap-4 text-3xl font-semibold text-memoria">
                {anio ?? TEXTO_FECHA_POR_CONFIRMAR}
                <span aria-hidden="true" className="h-px flex-1 bg-linea" />
              </h2>
              <ul className="grid gap-6 md:grid-cols-2">
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
            </section>
          ))}
        </div>
      )}
    </EstadoDeConsulta>
  )
}
