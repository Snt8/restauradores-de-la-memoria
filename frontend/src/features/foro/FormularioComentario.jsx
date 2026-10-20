import { useQueryClient } from '@tanstack/react-query'
import { foro } from '@/shared/api/foro.js'
import { CampoDeFormulario } from '@/shared/ui/CampoDeFormulario.jsx'
import { nombreGuardado, recordarNombre } from './identidad.js'
import { mensajeDeError, useFormularioForo } from './useFormularioForo.js'
import { LIMITES_FORO, validarComentario } from './validacion.js'

/**
 * Comentar una publicación o responder a un comentario (`padreId`). Al enviar recarga
 * el hilo y el contador de comentarios de la publicación.
 */
export function FormularioComentario({ publicacionId, padreId = null, onCancelar, onListo }) {
  const queryClient = useQueryClient()
  const esRespuesta = padreId !== null
  const { formulario, envio, alEnviar, setDatos, campo } = useFormularioForo({
    inicial: { contenido: '', autor: nombreGuardado() },
    validar: validarComentario,
    enviar: (datos) => foro.comentar(publicacionId, { ...datos, padre_id: padreId }),
    alPublicar: (_comentario, { autor }) => {
      recordarNombre(autor)
      setDatos({ contenido: '', autor })
      queryClient.invalidateQueries({ queryKey: foro.comentarios(publicacionId).queryKey })
      queryClient.invalidateQueries({ queryKey: foro.publicacion(publicacionId).queryKey })
      onListo?.()
    },
  })

  return (
    <form
      ref={formulario}
      noValidate
      onSubmit={alEnviar}
      aria-label={esRespuesta ? 'Responder comentario' : 'Escribir un comentario'}
      className="space-y-4"
    >
      <CampoDeFormulario
        etiqueta={esRespuesta ? 'Tu respuesta' : 'Tu comentario'}
        multilinea
        filas={esRespuesta ? 3 : 4}
        maxLength={LIMITES_FORO.comentario.maximo}
        placeholder="¿Qué piensas?"
        {...campo('contenido')}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="sm:w-64">
          <CampoDeFormulario
            etiqueta="Firma"
            autoComplete="nickname"
            maxLength={LIMITES_FORO.autor.maximo}
            {...campo('autor')}
          />
        </div>
        <div className="flex gap-2 sm:ml-auto">
          {onCancelar && (
            <button
              type="button"
              onClick={onCancelar}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-tinta-suave hover:bg-tinta/10"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={envio.isPending}
            className="rounded-full bg-memoria px-5 py-2.5 text-sm font-semibold text-white hover:bg-memoria-hondo disabled:opacity-60"
          >
            {envio.isPending ? 'Enviando…' : esRespuesta ? 'Responder' : 'Comentar'}
          </button>
        </div>
      </div>
      {envio.isError && (
        <p role="alert" className="rounded-lg bg-rosa/10 p-3 text-sm text-rosa">
          {mensajeDeError(envio.error)}
        </p>
      )}
    </form>
  )
}
