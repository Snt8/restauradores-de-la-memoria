import { useId } from 'react'

/**
 * Campo de formulario accesible: etiqueta asociada, marca de obligatorio, error
 * anunciado con `aria-describedby` y, si se indica, un contador de caracteres.
 * Lo comparten el formulario de contacto y los del foro.
 */
export function CampoDeFormulario({
  etiqueta,
  nombre,
  valor,
  error,
  onCambiar,
  tipo = 'text',
  multilinea,
  filas = 5,
  obligatorio,
  autoComplete,
  maxLength,
  ayuda,
  contador,
  placeholder,
}) {
  const id = useId()
  const idError = `${id}-error`
  const idAyuda = `${id}-ayuda`
  const Control = multilinea ? 'textarea' : 'input'
  const descripciones = [ayuda && idAyuda, error && idError].filter(Boolean).join(' ')

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="block text-sm font-semibold">
          {etiqueta}
          {obligatorio && (
            <span aria-hidden="true" className="text-rosa">
              {' '}
              *
            </span>
          )}
        </label>
        {contador && maxLength && (
          <span aria-hidden="true" className="text-xs text-tinta-suave tabular-nums">
            {valor.length.toLocaleString('es-CO')}/{maxLength.toLocaleString('es-CO')}
          </span>
        )}
      </div>
      {ayuda && (
        <p id={idAyuda} className="mt-1 text-sm text-tinta-suave">
          {ayuda}
        </p>
      )}
      <Control
        id={id}
        name={nombre}
        type={multilinea ? undefined : tipo}
        rows={multilinea ? filas : undefined}
        value={valor}
        maxLength={maxLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={obligatorio}
        aria-invalid={error ? true : undefined}
        aria-describedby={descripciones || undefined}
        onChange={(evento) => onCambiar(evento.target.value)}
        className={`mt-2 w-full rounded-lg border bg-white px-3.5 py-3 leading-relaxed ${
          error ? 'border-rosa' : 'border-tinta/20'
        }`}
      />
      {error && (
        <p id={idError} className="mt-1.5 text-sm text-rosa">
          {error}
        </p>
      )}
    </div>
  )
}
