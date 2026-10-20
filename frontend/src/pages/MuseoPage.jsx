import { PAGINAS, RUTAS } from '@/app/navegacion.js'
import { MUSEO } from '@/content/sitio.js'
import { Exposiciones } from '@/features/museo/Exposiciones.jsx'
import { ObjetosDelMuseo } from '@/features/museo/ObjetosDelMuseo.jsx'
import { InvitacionAlForo } from '@/features/paneles/PanelesDelPortal.jsx'
import { EnEstaPagina } from '@/shared/ui/EnEstaPagina.jsx'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { PlantillaDePagina } from '@/shared/ui/PlantillaDePagina.jsx'
import { PortadaDePagina } from '@/shared/ui/PortadaDePagina.jsx'
import { Seccion } from '@/shared/ui/Seccion.jsx'

const SECCIONES = [
  { id: 'sobre-el-museo', etiqueta: 'Sobre el museo' },
  { id: 'objetos', etiqueta: 'Objetos del museo' },
  { id: 'ediciones', etiqueta: 'Ediciones y exposiciones' },
  { id: 'creditos', etiqueta: 'Créditos' },
]

export function MuseoPage() {
  return (
    <PlantillaDePagina
      portada={
        <PortadaDePagina
          antetitulo="Museo"
          titulo={PAGINAS.museo.etiqueta}
          descripcion={MUSEO.presentacion[0]}
          icono={PAGINAS.museo.icono}
          acciones={
            <>
              <EnlaceBoton hacia={RUTAS.museoVirtual} icono="cubo">
                Entrar al Museo Virtual
              </EnlaceBoton>
              <EnlaceBoton hacia={RUTAS.galeria} variante="secundario" icono="imagen">
                Ver la galería
              </EnlaceBoton>
            </>
          }
        />
      }
      panel={
        <>
          <InvitacionAlForo
            titulo="¿Qué pieza te impactó?"
            texto="Cuéntalo en el foro y lee lo que otros visitantes descubrieron en el museo."
            categoria="museo"
          />
          <EnEstaPagina secciones={SECCIONES} />
        </>
      }
    >
      <Seccion id="sobre-el-museo" titulo="Sobre el museo">
        <div className="max-w-lectura space-y-4 text-lg leading-relaxed text-tinta-suave">
          {MUSEO.presentacion.slice(1).map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </div>
      </Seccion>

      <Seccion
        id="objetos"
        titulo="Objetos del museo"
        descripcion="Cada objeto tiene su ficha con fotografía, descripción, importancia para la memoria y créditos, y puede verse en 3D."
        variante="abierta"
      >
        <ObjetosDelMuseo />
      </Seccion>

      <Seccion
        id="ediciones"
        titulo="Ediciones y exposiciones"
        descripcion="Fotografías y videos de cada edición del Museo Escolar y de sus exposiciones en otros espacios."
        variante="abierta"
      >
        <Exposiciones />
      </Seccion>

      <Seccion id="creditos" titulo="Créditos">
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {MUSEO.creditos.map(([rol, quienes]) => (
            <div key={rol} className="border-l-2 border-memoria pl-4">
              <dt className="text-sm font-semibold tracking-wide text-memoria uppercase">{rol}</dt>
              <dd className="mt-1">{quienes}</dd>
            </div>
          ))}
        </dl>
      </Seccion>
    </PlantillaDePagina>
  )
}
