import { useQuery } from '@tanstack/react-query'
import { GaleriaDeEvidencias } from '@/entities/evidencia/GaleriaDeEvidencias.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { fechaParaAtributo, partesDeCalendario } from '@/shared/lib/fechas.js'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'

/** Fechas conmemorativas como hojas de calendario, en el orden del año. */
export function CalendarioConmemorativo() {
  const consulta = useQuery(recursos.actividades.lista({ tipo: 'fecha_conmemorativa' }))

  return (
    <EstadoDeConsulta consulta={consulta}>
      {({ elementos }) => (
        <ol className="space-y-8">
          {elementos.map((conmemoracion) => (
            <li key={conmemoracion.id}>
              <Conmemoracion conmemoracion={conmemoracion} />
            </li>
          ))}
        </ol>
      )}
    </EstadoDeConsulta>
  )
}

function Conmemoracion({ conmemoracion }) {
  const partes = partesDeCalendario(conmemoracion.fecha)

  return (
    <article className="grid gap-6 rounded-tarjeta bg-white p-5 shadow-tarjeta sm:grid-cols-[8rem_1fr] sm:p-6">
      {partes && (
        <time
          dateTime={fechaParaAtributo(conmemoracion.fecha)}
          className="flex h-32 w-32 flex-col overflow-hidden rounded-xl text-center shadow-tarjeta"
        >
          <span className="bg-rosa py-1 text-sm font-semibold tracking-widest text-white uppercase">
            {partes.mes}
          </span>
          <span className="flex flex-1 items-center justify-center bg-white font-display text-5xl font-semibold">
            {partes.dia}
          </span>
        </time>
      )}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{conmemoracion.nombre}</h2>
        {conmemoracion.descripcion && (
          <p className="leading-relaxed text-tinta-suave">{conmemoracion.descripcion}</p>
        )}
        <GaleriaDeEvidencias evidencias={conmemoracion.evidencias} />
      </div>
    </article>
  )
}
