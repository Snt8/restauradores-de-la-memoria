import { useId, useState } from 'react'
import { Icono } from '@/shared/ui/Icono.jsx'
import { contarRespuestas } from './arbol.js'
import { Avatar } from './Avatar.jsx'
import { ControlDeVoto } from './ControlDeVoto.jsx'
import { FormularioComentario } from './FormularioComentario.jsx'
import { InstanteRelativo } from './MetadatosDePublicacion.jsx'
import { useVoto } from './useVoto.js'

/**
 * Comentarios anidados al estilo de Reddit: cada respuesta cuelga de una línea vertical
 * que, al hacer clic, contrae todo el hilo. Desde el teclado se usa el botón [−]/[+].
 */
export function HiloDeComentarios({ hilo, publicacionId }) {
  return (
    <ol className="space-y-6">
      {hilo.map((nodo) => (
        <Comentario key={nodo.id} nodo={nodo} publicacionId={publicacionId} />
      ))}
    </ol>
  )
}

function Comentario({ nodo, publicacionId, profundidad = 0 }) {
  const [contraido, setContraido] = useState(false)
  const [respondiendo, setRespondiendo] = useState(false)
  const idAutor = useId()
  const voto = useVoto({
    objetivo: 'comentario',
    id: nodo.id,
    puntaje: nodo.puntaje,
    miVoto: nodo.mi_voto,
  })
  const ocultos = contarRespuestas(nodo)

  return (
    <li>
      <article aria-labelledby={idAutor} className="flex gap-3">
        <div className="flex flex-col items-center">
          <Avatar nombre={nodo.autor} tamano={profundidad === 0 ? 'normal' : 'pequeno'} />
          {!contraido && (
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => setContraido(true)}
              className="group mt-2 flex w-6 flex-1 cursor-pointer justify-center"
            >
              <span className="w-0.5 rounded-full bg-linea transition-colors group-hover:bg-memoria" />
            </button>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <header className="flex min-h-9 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span id={idAutor} className="font-semibold">
              {nodo.autor}
            </span>
            <span aria-hidden="true" className="text-tinta-suave">
              ·
            </span>
            <span className="text-tinta-suave">
              <InstanteRelativo instante={nodo.creado_en} />
            </span>
            {contraido && ocultos > 0 && (
              <span className="text-tinta-suave">
                · {ocultos === 1 ? '1 respuesta oculta' : `${ocultos} respuestas ocultas`}
              </span>
            )}
            <button
              type="button"
              aria-expanded={!contraido}
              onClick={() => setContraido(!contraido)}
              className="ml-auto grid size-8 place-items-center rounded-full text-tinta-suave hover:bg-tinta/10 hover:text-tinta"
            >
              <Icono nombre={contraido ? 'mas' : 'menos'} className="size-4" />
              <span className="sr-only">
                {contraido ? 'Mostrar' : 'Ocultar'} el comentario de {nodo.autor}
              </span>
            </button>
          </header>

          {!contraido && (
            <>
              <p className="mt-1 leading-relaxed [overflow-wrap:anywhere] whitespace-pre-line">
                {nodo.contenido}
              </p>
              <div className="mt-2 -ml-2 flex flex-wrap items-center gap-1">
                <ControlDeVoto voto={voto} orientacion="horizontal" />
                <button
                  type="button"
                  aria-expanded={respondiendo}
                  onClick={() => setRespondiendo(!respondiendo)}
                  className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-tinta-suave hover:bg-tinta/10 hover:text-tinta"
                >
                  <Icono nombre="comentario" className="size-4" />
                  Responder
                </button>
              </div>

              {respondiendo && (
                <div className="mt-3 rounded-lg border border-linea bg-papel/50 p-4">
                  <FormularioComentario
                    publicacionId={publicacionId}
                    padreId={nodo.id}
                    onCancelar={() => setRespondiendo(false)}
                    onListo={() => setRespondiendo(false)}
                  />
                </div>
              )}

              {nodo.respuestas.length > 0 && (
                <ol className="mt-5 space-y-5">
                  {nodo.respuestas.map((respuesta) => (
                    <Comentario
                      key={respuesta.id}
                      nodo={respuesta}
                      publicacionId={publicacionId}
                      profundidad={profundidad + 1}
                    />
                  ))}
                </ol>
              )}
            </>
          )}
        </div>
      </article>
    </li>
  )
}
