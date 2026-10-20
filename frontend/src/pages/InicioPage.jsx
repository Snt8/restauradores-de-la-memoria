import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { ACCESOS_PRINCIPALES, RUTAS } from '@/app/navegacion.js'
import { PROYECTO, QUE_ES } from '@/content/sitio.js'
import { Fecha } from '@/entities/contenido/Fecha.jsx'
import { AccesoAlForo, ForoDestacado } from '@/features/foro/ForoDestacado.jsx'
import { Exposiciones } from '@/features/museo/Exposiciones.jsx'
import { AccesoAlMuseoVirtual, AcercaDelProyecto } from '@/features/paneles/PanelesDelPortal.jsx'
import { miniaturaDeImagen } from '@/shared/api/media.js'
import { recursos } from '@/shared/api/recursos.js'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { CLASE_TARJETA_ENLAZADA } from '@/shared/ui/estilos.js'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { Icono } from '@/shared/ui/Icono.jsx'
import { PlantillaDePagina } from '@/shared/ui/PlantillaDePagina.jsx'
import { PortadaDePagina } from '@/shared/ui/PortadaDePagina.jsx'
import { Seccion } from '@/shared/ui/Seccion.jsx'
import { TarjetaPanel } from '@/shared/ui/TarjetaPanel.jsx'

/**
 * Portada del portal, como el inicio de Reddit: presentación arriba, lo más vivo del
 * foro y del museo en el centro, y el proyecto y sus reconocimientos a la derecha.
 */
export function InicioPage() {
  return (
    <PlantillaDePagina
      etiquetaDelPanel="Sobre el proyecto"
      portada={
        <PortadaDePagina
          tituloDocumento={`${PROYECTO.nombre} · ${PROYECTO.colegio}`}
          antetitulo={`${PROYECTO.colegio} · ${PROYECTO.localidad}`}
          titulo={PROYECTO.nombre}
          subtitulo={`«${PROYECTO.lema}»`}
          descripcion="El portal del Museo Escolar de la Memoria: objetos, fotografías, voces y evidencias de un colegio que decidió no olvidar."
          imagen={PROYECTO.imagenPrincipal}
          escudo={miniaturaDeImagen(PROYECTO.escudo)}
          acciones={
            <>
              <EnlaceBoton hacia={RUTAS.museoVirtual} icono="cubo">
                Recorrer el Museo Virtual
              </EnlaceBoton>
              <EnlaceBoton hacia={RUTAS.museo} variante="secundario" icono="flecha-derecha">
                Museo Escolar de la Memoria
              </EnlaceBoton>
            </>
          }
        />
      }
      panel={
        <>
          <AcercaDelProyecto />
          <ReconocimientosRecientes />
          <AccesoAlMuseoVirtual />
        </>
      }
    >
      <Seccion titulo="Un proyecto para no olvidar">
        <div className="max-w-lectura space-y-4 text-lg leading-relaxed text-tinta-suave">
          {QUE_ES.queEs.map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Desde el foro" variante="abierta" accion={<AccesoAlForo />}>
        <ForoDestacado />
      </Seccion>

      <Seccion titulo="Explora el portal" variante="abierta">
        <ul className="grid gap-3 sm:grid-cols-2">
          {ACCESOS_PRINCIPALES.map((pagina) => (
            <li key={pagina.ruta}>
              <Link
                to={pagina.ruta}
                className={`${CLASE_TARJETA_ENLAZADA} group flex h-full items-start gap-4 p-5`}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-memoria/10 text-memoria">
                  <Icono nombre={pagina.icono} className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold group-hover:text-memoria">
                    {pagina.etiqueta}
                  </span>
                  <span className="mt-1 block text-sm text-tinta-suave">{pagina.descripcion}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Seccion>

      <Seccion
        titulo="Exposiciones recientes"
        variante="abierta"
        accion={
          <EnlaceBoton hacia={RUTAS.museo} variante="secundario" icono="flecha-derecha">
            Ver todas
          </EnlaceBoton>
        }
      >
        <Exposiciones limite={2} />
      </Seccion>
    </PlantillaDePagina>
  )
}

function ReconocimientosRecientes() {
  const consulta = useQuery(recursos.reconocimientos.lista())

  return (
    <TarjetaPanel titulo="Reconocimientos recientes">
      <EstadoDeConsulta consulta={consulta} cargando={<p className="text-sm">Cargando…</p>}>
        {({ elementos }) => (
          <ol className="divide-y divide-linea">
            {elementos.slice(0, 3).map((reconocimiento) => (
              <li key={reconocimiento.id} className="py-3 first:pt-0 last:pb-0">
                <p className="text-xs font-semibold text-memoria">
                  <Fecha fecha={reconocimiento.fecha} />
                </p>
                <p className="mt-0.5 text-sm font-semibold">{reconocimiento.nombre}</p>
                {reconocimiento.otorgante && (
                  <p className="mt-0.5 text-sm text-tinta-suave">{reconocimiento.otorgante}</p>
                )}
              </li>
            ))}
          </ol>
        )}
      </EstadoDeConsulta>
      <Link
        to={RUTAS.reconocimientos}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-memoria hover:underline"
      >
        Ver todos los reconocimientos
        <Icono nombre="flecha-derecha" className="size-4" />
      </Link>
    </TarjetaPanel>
  )
}
