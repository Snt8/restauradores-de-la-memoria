import { RUTAS } from '@/app/navegacion.js'
import { FORO } from '@/content/foro.js'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { CLASE_TARJETA_FORO } from './estilos.js'

/** Columna derecha del foro: de qué trata, cómo participar y las normas de convivencia. */
export function PanelDelForo({ conBotonPublicar = true }) {
  return (
    <aside aria-label="Sobre el foro" className="space-y-5 self-start lg:sticky lg:top-28">
      <section
        aria-labelledby="titulo-acerca-foro"
        className={`${CLASE_TARJETA_FORO} overflow-hidden`}
      >
        <div aria-hidden="true" className="h-2 bg-gradient-to-r from-memoria via-vela to-rosa" />
        <div className="space-y-4 p-6">
          <h2 id="titulo-acerca-foro" className="font-sans text-base font-bold">
            Acerca del foro
          </h2>
          <p className="text-sm leading-relaxed text-tinta-suave">{FORO.presentacion}</p>
          {conBotonPublicar && (
            <EnlaceBoton
              hacia={RUTAS.nuevaPublicacionForo}
              icono="mas"
              className="w-full justify-center"
            >
              Crear publicación
            </EnlaceBoton>
          )}
        </div>
      </section>

      <section aria-labelledby="titulo-normas-foro" className={`${CLASE_TARJETA_FORO} p-6`}>
        <h2 id="titulo-normas-foro" className="font-sans text-base font-bold">
          Normas de convivencia
        </h2>
        <ol className="mt-4 divide-y divide-linea text-sm">
          {FORO.normas.map((norma, indice) => (
            <li key={norma} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <span className="font-bold text-memoria tabular-nums">{indice + 1}.</span>
              <span className="leading-relaxed text-tinta-suave">{norma}</span>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  )
}
