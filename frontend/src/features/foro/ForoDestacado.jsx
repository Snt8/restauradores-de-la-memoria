import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { RUTAS } from '@/app/navegacion.js'
import { CATEGORIA_POR_VALOR } from '@/content/foro.js'
import { foro } from '@/shared/api/foro.js'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { Etiqueta } from '@/shared/ui/Etiqueta.jsx'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'
import { textoDeComentarios } from './estilos.js'

/** Las conversaciones más activas del foro, para la página de inicio. */
export function ForoDestacado() {
  const consulta = useQuery(foro.destacadas({ limite: 3 }))

  return (
    <EstadoDeConsulta
      consulta={consulta}
      vacio="Aún no hay conversaciones. ¡Abre la primera desde el foro!"
    >
      {({ elementos }) => (
        <ul className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {elementos.map((publicacion) => {
            const categoria = CATEGORIA_POR_VALOR[publicacion.categoria]
            return (
              <li key={publicacion.id}>
                <article className="relative flex h-full flex-col gap-4 rounded-tarjeta bg-white p-6 shadow-tarjeta hover:ring-2 hover:ring-memoria sm:p-7">
                  {categoria && (
                    <div>
                      <Etiqueta tono={categoria.tono}>{categoria.etiqueta}</Etiqueta>
                    </div>
                  )}
                  <h3 className="font-sans text-lg leading-snug font-semibold">
                    <Link
                      to={RUTAS.publicacionForo(publicacion.id)}
                      className="after:absolute after:inset-0"
                    >
                      {publicacion.titulo}
                    </Link>
                  </h3>
                  <p className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm text-tinta-suave">
                    <span className="inline-flex items-center gap-1.5">
                      <Icono nombre="voto-arriba" className="size-4" />
                      {publicacion.puntaje} votos
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icono nombre="comentario" className="size-4" />
                      {textoDeComentarios(publicacion.comentarios)}
                    </span>
                  </p>
                </article>
              </li>
            )
          })}
        </ul>
      )}
    </EstadoDeConsulta>
  )
}

export function AccesoAlForo() {
  return (
    <EnlaceBoton hacia={RUTAS.foro} variante="secundario" icono="flecha-derecha">
      Ir al foro
    </EnlaceBoton>
  )
}
