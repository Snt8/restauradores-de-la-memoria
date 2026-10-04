import { GaleriaDeEvidencias } from '@/entities/evidencia/GaleriaDeEvidencias.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'
import { Fecha } from './Fecha.jsx'

/**
 * Tarjeta común a eventos, salidas, exposiciones, reconocimientos y formación:
 * nombre, fecha, lugar, descripción y sus evidencias. Cada sección solo decide qué
 * datos pasar y qué etiquetas agregar, sin repetir el marcado.
 */
export function TarjetaDeContenido({
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

  return (
    <article className="flex flex-col gap-4 rounded-tarjeta bg-white p-5 shadow-tarjeta sm:p-6">
      <header className="space-y-2">
        {etiquetas && <div className="flex flex-wrap gap-2">{etiquetas}</div>}
        <Titulo className="text-xl leading-snug font-semibold">{titulo}</Titulo>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-tinta-suave">
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
      </header>
      {descripcion && <p className="leading-relaxed text-tinta-suave">{descripcion}</p>}
      {children}
      {evidencias.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wider text-tinta-suave uppercase">
            Evidencias ({evidencias.length})
          </p>
          <GaleriaDeEvidencias evidencias={evidencias} />
        </div>
      )}
    </article>
  )
}
