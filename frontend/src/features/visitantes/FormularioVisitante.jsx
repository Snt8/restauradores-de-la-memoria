import { useMutation } from '@tanstack/react-query'
import { useId, useRef, useState } from 'react'
import { registrarVisitante } from '@/shared/api/recursos.js'
import { aCargaUtil, LIMITES, validarVisitante, VISITANTE_VACIO } from './validacion.js'

const TEXTOS = {
  contacto: {
    enviar: 'Enviar mensaje',
    exito: '¡Gracias! Recibimos tu mensaje y te responderemos al correo que indicaste.',
  },
  libro_visitas: {
    enviar: 'Firmar el libro de visitas',
    exito: '¡Gracias por tu visita! Tu firma quedó registrada en el libro del museo.',
  },
}

/**
 * Formulario de contacto o de libro de visitas (mismo componente, distinto `origen`).
 * Valida en el cliente, muestra los errores junto a cada campo y mueve el foco al primero.
 */
export function FormularioVisitante({ origen = 'contacto' }) {
  const exigeMensaje = origen === 'contacto'
  const [datos, setDatos] = useState(VISITANTE_VACIO)
  const [errores, setErrores] = useState({})
  const formulario = useRef(null)
  const envio = useMutation({
    // TanStack v5 llama mutationFn(variables, contexto): se pasa solo el primer argumento.
    mutationFn: (carga) => registrarVisitante(carga),
    onSuccess: () => setDatos(VISITANTE_VACIO),
  })

  function actualizar(campo, valor) {
    setDatos((previos) => ({ ...previos, [campo]: valor }))
    if (errores[campo]) setErrores(({ [campo]: _resuelto, ...resto }) => resto)
  }

  function alEnviar(evento) {
    evento.preventDefault()
    const encontrados = validarVisitante(datos, { exigeMensaje })
    setErrores(encontrados)
    const primero = Object.keys(encontrados)[0]
    if (primero) {
      formulario.current.elements.namedItem(primero)?.focus()
      return
    }
    envio.mutate(aCargaUtil(datos, origen))
  }

  const campo = (nombre) => ({
    nombre,
    valor: datos[nombre],
    error: errores[nombre],
    onCambiar: (valor) => actualizar(nombre, valor),
  })

  return (
    <form ref={formulario} noValidate onSubmit={alEnviar} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo etiqueta="Nombre" autoComplete="name" obligatorio {...campo('nombre')} />
        <Campo
          etiqueta="Correo electrónico"
          tipo="email"
          autoComplete="email"
          obligatorio
          {...campo('correo')}
        />
        <Campo etiqueta="Institución" autoComplete="organization" {...campo('institucion')} />
        <Campo etiqueta="Rol (estudiante, docente, familia…)" {...campo('rol')} />
      </div>
      <Campo
        etiqueta={exigeMensaje ? 'Mensaje' : 'Mensaje para el libro (opcional)'}
        multilinea
        obligatorio={exigeMensaje}
        {...campo('mensaje')}
      />

      <Consentimiento
        marcado={datos.consentimiento_datos}
        error={errores.consentimiento_datos}
        onCambiar={(valor) => actualizar('consentimiento_datos', valor)}
      />

      {envio.isError && (
        <p role="alert" className="rounded-lg bg-rosa/10 p-4 text-sm text-rosa">
          {envio.error?.body?.detail && typeof envio.error.body.detail === 'string'
            ? envio.error.body.detail
            : 'No pudimos enviar el formulario. Revisa tu conexión e inténtalo de nuevo.'}
        </p>
      )}
      {envio.isSuccess && (
        <p role="status" className="rounded-lg bg-memoria/10 p-4 text-sm text-memoria-hondo">
          {TEXTOS[origen].exito}
        </p>
      )}

      <button
        type="submit"
        disabled={envio.isPending}
        className="rounded-full bg-memoria px-6 py-3 font-semibold text-white hover:bg-memoria-hondo disabled:opacity-60"
      >
        {envio.isPending ? 'Enviando…' : TEXTOS[origen].enviar}
      </button>
    </form>
  )
}

function Campo({
  etiqueta,
  nombre,
  valor,
  error,
  onCambiar,
  tipo = 'text',
  multilinea,
  obligatorio,
  autoComplete,
}) {
  const id = useId()
  const idError = `${id}-error`
  const Control = multilinea ? 'textarea' : 'input'

  return (
    <div className={multilinea ? '' : 'space-y-1'}>
      <label htmlFor={id} className="block text-sm font-semibold">
        {etiqueta}
        {obligatorio && (
          <span aria-hidden="true" className="text-rosa">
            {' '}
            *
          </span>
        )}
      </label>
      <Control
        id={id}
        name={nombre}
        type={multilinea ? undefined : tipo}
        rows={multilinea ? 5 : undefined}
        value={valor}
        maxLength={LIMITES[nombre]}
        autoComplete={autoComplete}
        required={obligatorio}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? idError : undefined}
        onChange={(evento) => onCambiar(evento.target.value)}
        className={`mt-1 w-full rounded-lg border bg-white px-3 py-2.5 ${
          error ? 'border-rosa' : 'border-tinta/20'
        }`}
      />
      {error && (
        <p id={idError} className="mt-1 text-sm text-rosa">
          {error}
        </p>
      )}
    </div>
  )
}

function Consentimiento({ marcado, error, onCambiar }) {
  const id = useId()
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name="consentimiento_datos"
          type="checkbox"
          checked={marcado}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(evento) => onCambiar(evento.target.checked)}
          className="mt-1 size-4 accent-memoria"
        />
        <label htmlFor={id} className="text-sm text-tinta-suave">
          Autorizo al Colegio Tom Adams IED a tratar mis datos personales solo para responder este
          mensaje, conforme a la Ley 1581 de 2012 (habeas data).
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-rosa">
          {error}
        </p>
      )}
    </div>
  )
}
