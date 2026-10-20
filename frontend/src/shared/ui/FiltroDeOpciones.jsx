import { Icono } from './Icono.jsx'

/**
 * Grupo de botones para filtrar una colección. Cada botón anuncia si está activo
 * (`aria-pressed`), así funciona igual con mouse, teclado y lector de pantalla.
 *
 * @param opciones  [{ valor, etiqueta, icono? }]; el valor `null` representa «Todos»
 */
export function FiltroDeOpciones({ etiqueta, opciones, valor, onCambiar }) {
  return (
    <div role="group" aria-label={etiqueta} className="flex flex-wrap gap-2">
      {opciones.map((opcion) => {
        const activa = opcion.valor === valor
        return (
          <button
            key={opcion.valor ?? 'todos'}
            type="button"
            aria-pressed={activa}
            onClick={() => onCambiar(opcion.valor)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              activa
                ? 'border-memoria bg-memoria text-white'
                : 'border-tinta/20 bg-white text-tinta-suave hover:border-memoria hover:text-memoria'
            }`}
          >
            {opcion.icono && <Icono nombre={opcion.icono} className="size-4" />}
            {opcion.etiqueta}
          </button>
        )
      })}
    </div>
  )
}
