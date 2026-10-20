import { GaleriaDeEvidencias } from '@/entities/evidencia/GaleriaDeEvidencias.jsx'
import { CLASE_TARJETA } from '@/shared/ui/estilos.js'
import { Icono } from '@/shared/ui/Icono.jsx'
import { Fecha } from './Fecha.jsx'

/**
 * Tarjeta común a eventos, salidas, exposiciones, reconocimientos y formación, con la
 * forma de una publicación del foro: contexto arriba (etiquetas, fecha, lugar), título,
 * descripción a ancho de lectura y sus evidencias. Cada sección solo decide qué datos
 * pasar y qué etiquetas agregar, sin repetir el marcado.
 */
export function TarjetaDeContenido({
  id,
  titulo,
  fecha,
  lugar,
  descripcion,
  etiquetas,
  evidencias = [],
  nivelDeTitulo = 3,
  children,
}) {
  const Titulo = `h${nivelDeTitulo}`
  const conContexto = etiquetas || fecha !== undefined || lugar

  return (
    <article id={id} className={`${CLASE_TARJETA} scroll-mt-24 p-5 sm:p-6`}>
      {conContexto && (
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-tinta-suave">
          {etiquetas}
          {fecha !== undefined && (
            <span className="inline-flex items-center gap-1.5">
              <Icono nombre="calendario" className="size-4" />
              <Fecha fecha={fecha} />
            </span>
          )}
          {lugar && (
            <span className="inline-flex items-center gap-1.5">
              <Icono nombre="ubicacion" className="size-4" />
              {lugar}
            </span>
          )}
        </p>
      )}
      <Titulo
        className={`${conContexto ? 'mt-3' : ''} font-sans text-xl leading-snug font-semibold text-pretty`}
      >
        {titulo}
      </Titulo>
      {descripcion && (
        <p className="mt-2 max-w-lectura leading-relaxed text-tinta-suave">{descripcion}</p>
      )}
      {children && <div className="mt-3">{children}</div>}
      {evidencias.length > 0 && (
        <div className="mt-5 border-t border-linea pt-4">
          <p className="mb-3 text-xs font-semibold tracking-wider text-tinta-suave uppercase">
            Evidencias ({evidencias.length})
          </p>
          <GaleriaDeEvidencias evidencias={evidencias} />
        </div>
      )}
    </article>
  )
}
