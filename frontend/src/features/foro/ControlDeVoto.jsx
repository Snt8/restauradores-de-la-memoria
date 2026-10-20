import { Icono } from '@/shared/ui/Icono.jsx'

const compacto = new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 1 })

const COLOR_DEL_PUNTAJE = { 1: 'text-rosa', '-1': 'text-cielo', 0: 'text-tinta' }

/**
 * Flechas de voto y puntaje. En columna (tarjetas en pantallas medianas y grandes) o en
 * fila dentro de una píldora (móvil y comentarios), como en Reddit. Recibe el estado de
 * `useVoto` para que dos controles de la misma publicación nunca se contradigan.
 */
export function ControlDeVoto({ voto, orientacion = 'vertical', titulo }) {
  const vertical = orientacion === 'vertical'

  return (
    <div
      role="group"
      aria-label={titulo ? `Votos de «${titulo}»` : 'Votos'}
      className={`relative z-10 flex items-center ${
        vertical ? 'flex-col gap-0.5' : 'gap-0.5 rounded-full bg-papel-hondo'
      }`}
    >
      <BotonDeVoto
        icono="voto-arriba"
        etiqueta="Votar a favor"
        activo={voto.miVoto === 1}
        claseActiva="text-rosa"
        onClick={() => voto.votar(1)}
      />
      <span
        aria-live="polite"
        className={`min-w-[2.5ch] text-center text-sm font-bold tabular-nums ${
          COLOR_DEL_PUNTAJE[voto.miVoto]
        }`}
      >
        <span className="sr-only">Puntaje: </span>
        {compacto.format(voto.puntaje)}
      </span>
      <BotonDeVoto
        icono="voto-abajo"
        etiqueta="Votar en contra"
        activo={voto.miVoto === -1}
        claseActiva="text-cielo"
        onClick={() => voto.votar(-1)}
      />
      {voto.fallo && (
        <span role="alert" className="sr-only">
          No pudimos registrar tu voto. Inténtalo de nuevo.
        </span>
      )}
    </div>
  )
}

function BotonDeVoto({ icono, etiqueta, activo, claseActiva, onClick }) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      aria-pressed={activo}
      onClick={onClick}
      className={`grid size-9 place-items-center rounded-full transition-colors hover:bg-tinta/10 ${
        activo ? `${claseActiva} [&_svg]:fill-current` : 'text-tinta-suave hover:text-tinta'
      }`}
    >
      <Icono nombre={icono} className="size-5" />
    </button>
  )
}
