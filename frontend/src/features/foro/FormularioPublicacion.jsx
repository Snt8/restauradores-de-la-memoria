import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { RUTAS } from '@/app/navegacion.js'
import { CATEGORIAS_FORO } from '@/content/foro.js'
import { foro } from '@/shared/api/foro.js'
import { CampoDeFormulario } from '@/shared/ui/CampoDeFormulario.jsx'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { nombreGuardado, recordarNombre } from './identidad.js'
import { mensajeDeError, useFormularioForo } from './useFormularioForo.js'
import { LIMITES_FORO, validarPublicacion } from './validacion.js'

/** Crear una publicación: categoría, título, contenido y firma. Al publicar, abre la publicación. */
export function FormularioPublicacion({ categoriaInicial }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { datos, errores, formulario, envio, alEnviar, actualizar, campo } = useFormularioForo({
    inicial: {
      categoria: categoriaInicial ?? '',
      titulo: '',
      contenido: '',
      autor: nombreGuardado(),
    },
    validar: validarPublicacion,
    enviar: foro.publicar,
    alPublicar: (publicacion, { autor }) => {
      recordarNombre(autor)
      queryClient.invalidateQueries({ queryKey: foro.raiz })
      navigate(RUTAS.publicacionForo(publicacion.id))
    },
  })

  return (
    <form ref={formulario} noValidate onSubmit={alEnviar} className="space-y-7">
      <fieldset aria-describedby={errores.categoria ? 'error-categoria' : undefined}>
        <legend className="text-sm font-semibold">
          Categoría
          <span aria-hidden="true" className="text-rosa">
            {' '}
            *
          </span>
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {CATEGORIAS_FORO.map((categoria) => (
            <label
              key={categoria.valor}
              className={`flex cursor-pointer gap-3 rounded-lg border p-3.5 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-memoria ${
                datos.categoria === categoria.valor
                  ? 'border-memoria bg-memoria/5'
                  : 'border-tinta/15 hover:border-tinta/40'
              }`}
            >
              <input
                type="radio"
                name="categoria"
                value={categoria.valor}
                checked={datos.categoria === categoria.valor}
                onChange={() => actualizar('categoria', categoria.valor)}
                className="mt-1 size-4 accent-memoria"
              />
              <span>
                <span className="block text-sm font-semibold">{categoria.etiqueta}</span>
                <span className="block text-sm text-tinta-suave">{categoria.descripcion}</span>
              </span>
            </label>
          ))}
        </div>
        {errores.categoria && (
          <p id="error-categoria" className="mt-1.5 text-sm text-rosa">
            {errores.categoria}
          </p>
        )}
      </fieldset>

      <CampoDeFormulario
        etiqueta="Título"
        obligatorio
        contador
        maxLength={LIMITES_FORO.titulo.maximo}
        placeholder="Una pregunta o idea clara, en una línea"
        {...campo('titulo')}
      />
      <CampoDeFormulario
        etiqueta="Contenido"
        multilinea
        filas={8}
        obligatorio
        contador
        maxLength={LIMITES_FORO.contenido.maximo}
        ayuda="Cuenta el contexto: qué viste, qué recuerdas o qué te gustaría saber."
        {...campo('contenido')}
      />
      <CampoDeFormulario
        etiqueta="Firma"
        obligatorio
        autoComplete="nickname"
        maxLength={LIMITES_FORO.autor.maximo}
        ayuda="Tu nombre o un apodo. Se mostrará públicamente; no escribas datos personales."
        {...campo('autor')}
      />

      {envio.isError && (
        <p role="alert" className="rounded-lg bg-rosa/10 p-4 text-sm text-rosa">
          {mensajeDeError(envio.error)}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-linea pt-6">
        <button
          type="submit"
          disabled={envio.isPending}
          className="rounded-full bg-memoria px-6 py-3 font-semibold text-white hover:bg-memoria-hondo disabled:opacity-60"
        >
          {envio.isPending ? 'Publicando…' : 'Publicar'}
        </button>
        <EnlaceBoton hacia={RUTAS.foro} variante="secundario">
          Cancelar
        </EnlaceBoton>
      </div>
    </form>
  )
}
