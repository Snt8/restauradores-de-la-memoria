import { RUTAS } from '@/app/navegacion.js'
import { FORO } from '@/content/foro.js'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { TarjetaPanel } from '@/shared/ui/TarjetaPanel.jsx'

/** Tarjetas del panel derecho del foro: de qué trata, cómo participar y las normas. */
export function PanelDelForo({ conBotonPublicar = true }) {
  return (
    <>
      <TarjetaPanel titulo="Acerca del foro" destacada>
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
      </TarjetaPanel>

      <TarjetaPanel titulo="Normas de convivencia" fija>
        <ol className="divide-y divide-linea text-sm">
          {FORO.normas.map((norma, indice) => (
            <li key={norma} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <span className="font-bold text-memoria tabular-nums">{indice + 1}.</span>
              <span className="leading-relaxed text-tinta-suave">{norma}</span>
            </li>
          ))}
        </ol>
      </TarjetaPanel>
    </>
  )
}
