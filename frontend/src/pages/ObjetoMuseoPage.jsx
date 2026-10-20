import { useQuery } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import { useParams } from 'react-router'
import { PAGINAS, RUTAS } from '@/app/navegacion.js'
import { Fecha } from '@/entities/contenido/Fecha.jsx'
import { GaleriaDeEvidencias } from '@/entities/evidencia/GaleriaDeEvidencias.jsx'
import { InvitacionAlForo } from '@/features/paneles/PanelesDelPortal.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { CLASE_TARJETA } from '@/shared/ui/estilos.js'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { ImagenResponsiva } from '@/shared/ui/ImagenResponsiva.jsx'
import { PlantillaDePagina } from '@/shared/ui/PlantillaDePagina.jsx'
import { PortadaDePagina } from '@/shared/ui/PortadaDePagina.jsx'
import { Seccion } from '@/shared/ui/Seccion.jsx'
import { TarjetaPanel } from '@/shared/ui/TarjetaPanel.jsx'
import { NoEncontradaPage } from './NoEncontradaPage.jsx'

// El visor arrastra A-Frame: se descarga solo cuando la ficha se abre.
const VisorDeModelo = lazy(() =>
  import('@/features/museo-virtual/VisorDeModelo.jsx').then((m) => ({ default: m.VisorDeModelo })),
)

/** Ficha de un objeto del museo: modelo 3D, fotografía, descripción, importancia y créditos. */
export function ObjetoMuseoPage() {
  const { slug } = useParams()
  const consulta = useQuery(recursos.objetos.detalle(slug))

  if (consulta.error?.status === 404) return <NoEncontradaPage />

  return (
    <EstadoDeConsulta consulta={consulta} esVacio={() => false}>
      {(objeto) => <Ficha objeto={objeto} />}
    </EstadoDeConsulta>
  )
}

function Ficha({ objeto }) {
  return (
    <PlantillaDePagina
      portada={
        <PortadaDePagina
          antetitulo="Objeto del museo"
          titulo={objeto.nombre}
          icono="cubo"
          migas={[{ etiqueta: PAGINAS.museo.corta, ruta: RUTAS.museo }]}
          acciones={
            <EnlaceBoton
              hacia={`${RUTAS.museoVirtual}?objeto=${encodeURIComponent(objeto.slug)}`}
              icono="cubo"
            >
              Verlo en la sala del Museo Virtual
            </EnlaceBoton>
          }
        />
      }
      panel={
        <>
          <TarjetaPanel titulo="Ficha del objeto" destacada>
            <dl className="divide-y divide-linea text-sm">
              <Dato etiqueta="Fecha">
                <Fecha fecha={objeto.fecha} />
              </Dato>
              <Dato etiqueta="Créditos">{objeto.creditos ?? 'Por confirmar'}</Dato>
              {objeto.exposiciones.length > 0 && (
                <Dato etiqueta="Exhibido en">
                  {objeto.exposiciones.map((exposicion) => exposicion.nombre).join(', ')}
                </Dato>
              )}
            </dl>
          </TarjetaPanel>
          <InvitacionAlForo
            titulo="¿Qué te dice este objeto?"
            texto="Comparte en el foro lo que te hace pensar o recordar."
            categoria="museo"
          />
        </>
      }
    >
      <div className={`${CLASE_TARJETA} space-y-5 p-4 sm:p-5`}>
        {objeto.modelo_3d_url ? (
          <Suspense fallback={<p role="status">Cargando el visor 3D…</p>}>
            <VisorDeModelo objeto={objeto} />
          </Suspense>
        ) : (
          <p className="rounded-lg bg-papel-hondo p-6">Modelo 3D pendiente.</p>
        )}
        {objeto.foto_url ? (
          <ImagenResponsiva
            url={objeto.foto_url}
            alt={`Fotografía de ${objeto.nombre}`}
            sizes="(min-width: 1280px) 50rem, 100vw"
            className="w-full rounded-lg"
          />
        ) : (
          <p className="rounded-lg bg-papel-hondo p-4 text-sm text-tinta-suave">
            Fotografía del objeto pendiente: se agregará cuando el equipo digitalice la pieza real.
          </p>
        )}
      </div>

      <Seccion titulo="Descripción">
        <p className="max-w-lectura text-lg leading-relaxed">{objeto.descripcion}</p>
      </Seccion>
      {objeto.importancia_memoria && (
        <Seccion titulo="Importancia para la memoria" className="border-l-4 border-l-vela">
          <p className="max-w-lectura text-lg leading-relaxed">{objeto.importancia_memoria}</p>
        </Seccion>
      )}
      {objeto.evidencias.length > 0 && (
        <Seccion titulo="Evidencias">
          <GaleriaDeEvidencias evidencias={objeto.evidencias} densidad="amplia" />
        </Seccion>
      )}
    </PlantillaDePagina>
  )
}

function Dato({ etiqueta, children }) {
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <dt className="text-xs font-semibold tracking-wider text-tinta-suave uppercase">
        {etiqueta}
      </dt>
      <dd className="mt-1">{children}</dd>
    </div>
  )
}
