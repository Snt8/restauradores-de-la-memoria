import { GaleriaDeEvidencias } from '@/entities/evidencia/GaleriaDeEvidencias.jsx'
import { fechaParaAtributo, formatearFecha, partesDeCalendario } from '@/shared/lib/fechas.js'
import { EnEstaPagina } from '@/shared/ui/EnEstaPagina.jsx'
import { CLASE_TARJETA } from '@/shared/ui/estilos.js'
import { TarjetaPanel } from '@/shared/ui/TarjetaPanel.jsx'
import { idDeConmemoracion, proximaConmemoracion, textoDeDiasRestantes } from './conmemoraciones.js'

/** Fechas conmemorativas como hojas de calendario, en el orden del año. */
export function CalendarioConmemorativo({ conmemoraciones }) {
  return (
    <ol className="space-y-4">
      {conmemoraciones.map((conmemoracion) => (
        <li key={conmemoracion.id}>
          <Conmemoracion conmemoracion={conmemoracion} />
        </li>
      ))}
    </ol>
  )
}

function Conmemoracion({ conmemoracion }) {
  const partes = partesDeCalendario(conmemoracion.fecha)

  return (
    <article
      id={idDeConmemoracion(conmemoracion)}
      className={`${CLASE_TARJETA} grid scroll-mt-24 gap-5 p-5 sm:grid-cols-[6.5rem_1fr] sm:gap-6 sm:p-6`}
    >
      {partes && (
        <time
          dateTime={fechaParaAtributo(conmemoracion.fecha)}
          className="flex size-26 flex-col overflow-hidden rounded-xl border border-linea text-center"
        >
          <span className="bg-rosa py-1 text-xs font-semibold tracking-widest text-white uppercase">
            {partes.mes}
          </span>
          <span className="flex flex-1 items-center justify-center bg-white font-display text-4xl font-semibold">
            {partes.dia}
          </span>
        </time>
      )}
      <div className="min-w-0 space-y-3">
        <h2 className="font-sans text-xl leading-snug font-semibold text-pretty">
          {conmemoracion.nombre}
        </h2>
        {conmemoracion.descripcion && (
          <p className="max-w-lectura leading-relaxed text-tinta-suave">
            {conmemoracion.descripcion}
          </p>
        )}
        <GaleriaDeEvidencias evidencias={conmemoracion.evidencias} />
      </div>
    </article>
  )
}

/** Panel: la próxima fecha a recordar y el índice del calendario. */
export function PanelDelCalendario({ conmemoraciones }) {
  const proxima = proximaConmemoracion(conmemoraciones)

  return (
    <>
      {proxima && (
        <TarjetaPanel titulo="Próxima conmemoración" destacada>
          <a
            href={`#${idDeConmemoracion(proxima.conmemoracion)}`}
            className="block rounded-lg hover:text-memoria"
          >
            <span className="block text-sm font-semibold text-rosa">
              {`${formatearFecha(proxima.conmemoracion.fecha)} · ${textoDeDiasRestantes(proxima.dias)}`}
            </span>
            <span className="mt-1 block font-display text-xl leading-snug">
              {proxima.conmemoracion.nombre}
            </span>
          </a>
        </TarjetaPanel>
      )}
      <EnEstaPagina
        titulo="Calendario"
        secciones={conmemoraciones.map((conmemoracion) => ({
          id: idDeConmemoracion(conmemoracion),
          etiqueta: conmemoracion.nombre,
          detalle: formatearFecha(conmemoracion.fecha) ?? undefined,
        }))}
      />
    </>
  )
}
