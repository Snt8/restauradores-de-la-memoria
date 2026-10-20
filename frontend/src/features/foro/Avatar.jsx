const FONDOS = ['bg-memoria', 'bg-rosa', 'bg-cielo', 'bg-memoria-hondo', 'bg-tinta-suave']

const TAMANOS = { normal: 'size-9 text-sm', pequeno: 'size-7 text-xs' }

/** Color estable por nombre: la misma persona conserva su color en todo el foro. */
function fondoDe(nombre) {
  let suma = 0
  for (const letra of nombre) suma = (suma * 31 + letra.codePointAt(0)) % 997
  return FONDOS[suma % FONDOS.length]
}

/** Inicial de quien firma sobre un círculo de color (decorativo: el nombre ya se lee al lado). */
export function Avatar({ nombre, tamano = 'normal' }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full font-bold text-white uppercase ${
        TAMANOS[tamano]
      } ${fondoDe(nombre)}`}
    >
      {[...nombre.trim()][0] ?? '?'}
    </span>
  )
}
