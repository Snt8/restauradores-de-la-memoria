import { Link } from 'react-router'
import { RUTAS } from '@/app/navegacion.js'
import { CATEGORIA_POR_VALOR } from '@/content/foro.js'
import { fechaYHora, tiempoRelativo } from '@/shared/lib/fechas.js'
import { Etiqueta } from '@/shared/ui/Etiqueta.jsx'

/** Categoría, autor y antigüedad: la línea de contexto sobre el título de cada publicación. */
export function MetadatosDePublicacion({ publicacion }) {
  const categoria = CATEGORIA_POR_VALOR[publicacion.categoria]

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-tinta-suave">
      {categoria && (
        <Link
          to={`${RUTAS.foro}?categoria=${categoria.valor}`}
          className="relative z-10 rounded-full hover:opacity-80"
        >
          <Etiqueta tono={categoria.tono}>{categoria.etiqueta}</Etiqueta>
        </Link>
      )}
      <span>
        Publicado por <span className="font-semibold text-tinta">{publicacion.autor}</span>
      </span>
      <span aria-hidden="true">·</span>
      <InstanteRelativo instante={publicacion.creado_en} />
    </p>
  )
}

export function InstanteRelativo({ instante }) {
  return (
    <time dateTime={instante} title={fechaYHora(instante)}>
      {tiempoRelativo(instante)}
    </time>
  )
}
