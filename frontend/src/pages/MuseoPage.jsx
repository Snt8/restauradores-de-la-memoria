import { PAGINAS, RUTAS } from '@/app/navegacion.js'
import { MUSEO } from '@/content/sitio.js'
import { Exposiciones } from '@/features/museo/Exposiciones.jsx'
import { ObjetosDelMuseo } from '@/features/museo/ObjetosDelMuseo.jsx'
import { EncabezadoDePagina } from '@/shared/ui/EncabezadoDePagina.jsx'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { Seccion } from '@/shared/ui/Seccion.jsx'

export function MuseoPage() {
  return (
    <>
      <EncabezadoDePagina
        antetitulo="Museo"
        titulo={PAGINAS.museo.etiqueta}
        entradilla={MUSEO.presentacion[0]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <EnlaceBoton hacia={RUTAS.museoVirtual} icono="cubo">
            Entrar al Museo Virtual
          </EnlaceBoton>
          <EnlaceBoton hacia={RUTAS.galeria} variante="secundario" icono="imagen">
            Ver la galería
          </EnlaceBoton>
        </div>
      </EncabezadoDePagina>

      <Seccion titulo="Sobre el museo">
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-tinta-suave">
          {MUSEO.presentacion.slice(1).map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </div>
      </Seccion>

      <Seccion
        titulo="Objetos del museo"
        descripcion="Cada objeto tiene su ficha con fotografía, descripción, importancia para la memoria y créditos, y puede verse en 3D."
        className="bg-papel-hondo"
      >
        <ObjetosDelMuseo />
      </Seccion>

      <Seccion
        titulo="Ediciones y exposiciones"
        descripcion="Fotografías y videos de cada edición del Museo Escolar y de sus exposiciones en otros espacios."
      >
        <Exposiciones />
      </Seccion>

      <Seccion titulo="Créditos" className="bg-papel-hondo">
        <dl className="grid gap-4 sm:grid-cols-2">
          {MUSEO.creditos.map(([rol, quienes]) => (
            <div key={rol} className="rounded-tarjeta bg-white p-5 shadow-tarjeta">
              <dt className="text-sm font-semibold tracking-wide text-memoria uppercase">{rol}</dt>
              <dd className="mt-1">{quienes}</dd>
            </div>
          ))}
        </dl>
      </Seccion>
    </>
  )
}
