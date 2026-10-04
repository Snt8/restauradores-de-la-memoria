import { useQuery } from '@tanstack/react-query'
import { TarjetaDeContenido } from '@/entities/contenido/TarjetaDeContenido.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'

/** Ediciones del Museo Escolar y exposiciones externas, de la más reciente a la más antigua. */
export function Exposiciones({ limite }) {
  const consulta = useQuery(recursos.exposiciones.lista())

  return (
    <EstadoDeConsulta consulta={consulta}>
      {({ elementos }) => (
        <ol className="grid gap-6 lg:grid-cols-2">
          {elementos.slice(0, limite).map((exposicion) => (
            <li key={exposicion.id}>
              <TarjetaDeContenido
                titulo={exposicion.nombre}
                fecha={exposicion.fecha}
                lugar={exposicion.lugar}
                descripcion={exposicion.descripcion}
                evidencias={exposicion.evidencias}
              />
            </li>
          ))}
        </ol>
      )}
    </EstadoDeConsulta>
  )
}
