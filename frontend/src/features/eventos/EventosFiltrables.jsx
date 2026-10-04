import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { TarjetaDeContenido } from '@/entities/contenido/TarjetaDeContenido.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { useFiltroEnUrl } from '@/shared/lib/useFiltroEnUrl.js'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { Etiqueta } from '@/shared/ui/Etiqueta.jsx'
import { FiltroDeOpciones } from '@/shared/ui/FiltroDeOpciones.jsx'

const TIPOS_DE_EVENTO = Object.freeze({
  visita: { etiqueta: 'Visitas', singular: 'Visita', tono: 'memoria' },
  evento: { etiqueta: 'Eventos', singular: 'Evento', tono: 'vela' },
  medios: { etiqueta: 'En los medios', singular: 'Medios', tono: 'rosa' },
})

const OPCIONES = [
  { valor: null, etiqueta: 'Todo' },
  ...Object.entries(TIPOS_DE_EVENTO).map(([valor, { etiqueta }]) => ({ valor, etiqueta })),
]

/** Visitas, eventos y medios con un filtro por tipo que se resuelve en la API. */
export function EventosFiltrables() {
  const [tipo, cambiarTipo] = useFiltroEnUrl('tipo', Object.keys(TIPOS_DE_EVENTO))
  const consulta = useQuery({
    ...recursos.eventos.lista(tipo ? { tipo } : {}),
    placeholderData: keepPreviousData,
  })

  return (
    <div className="space-y-8">
      <FiltroDeOpciones
        etiqueta="Filtrar por tipo"
        opciones={OPCIONES}
        valor={tipo}
        onCambiar={cambiarTipo}
      />
      <EstadoDeConsulta consulta={consulta} vacio="No hay registros de este tipo todavía.">
        {({ elementos, total }) => (
          <>
            <p aria-live="polite" className="text-sm text-tinta-suave">
              {total} {total === 1 ? 'registro' : 'registros'}
            </p>
            <ul className="grid gap-6 md:grid-cols-2">
              {elementos.map((evento) => (
                <li key={evento.id}>
                  <TarjetaDeContenido
                    titulo={evento.nombre}
                    fecha={evento.fecha}
                    lugar={evento.lugar}
                    descripcion={evento.descripcion}
                    evidencias={evento.evidencias}
                    etiquetas={
                      <Etiqueta tono={TIPOS_DE_EVENTO[evento.tipo].tono}>
                        {TIPOS_DE_EVENTO[evento.tipo].singular}
                      </Etiqueta>
                    }
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </EstadoDeConsulta>
    </div>
  )
}
