import { useQuery } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import { Link, useParams } from 'react-router'
import { RUTAS } from '@/app/navegacion.js'
import { Fecha } from '@/entities/contenido/Fecha.jsx'
import { GaleriaDeEvidencias } from '@/entities/evidencia/GaleriaDeEvidencias.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { EncabezadoDePagina } from '@/shared/ui/EncabezadoDePagina.jsx'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { ImagenResponsiva } from '@/shared/ui/ImagenResponsiva.jsx'
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
    <>
      <EncabezadoDePagina antetitulo="Objeto del museo" titulo={objeto.nombre}>
        <nav aria-label="Ruta de navegación" className="mt-4 text-sm text-tinta-suave">
          <Link to={RUTAS.museo} className="hover:text-memoria hover:underline">
            Museo Escolar de la Memoria
          </Link>{' '}
          / {objeto.nombre}
        </nav>
      </EncabezadoDePagina>

      <Contenedor className="grid gap-10 py-12 lg:grid-cols-2">
        <div className="space-y-6">
          {objeto.modelo_3d_url ? (
            <Suspense fallback={<p role="status">Cargando el visor 3D…</p>}>
              <VisorDeModelo objeto={objeto} />
            </Suspense>
          ) : (
            <p className="rounded-tarjeta bg-papel-hondo p-6">Modelo 3D pendiente.</p>
          )}
          {objeto.foto_url ? (
            <ImagenResponsiva
              url={objeto.foto_url}
              alt={`Fotografía de ${objeto.nombre}`}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-full rounded-tarjeta"
            />
          ) : (
            <p className="rounded-tarjeta bg-papel-hondo p-4 text-sm text-tinta-suave">
              Fotografía del objeto pendiente: se agregará cuando el equipo digitalice la pieza
              real.
            </p>
          )}
        </div>

        <article className="space-y-8">
          <Bloque titulo="Descripción">
            <p className="leading-relaxed">{objeto.descripcion}</p>
          </Bloque>
          {objeto.importancia_memoria && (
            <Bloque titulo="Importancia para la memoria">
              <p className="leading-relaxed">{objeto.importancia_memoria}</p>
            </Bloque>
          )}
          <dl className="grid gap-4 sm:grid-cols-2">
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
          <EnlaceBoton
            hacia={`${RUTAS.museoVirtual}?objeto=${encodeURIComponent(objeto.slug)}`}
            icono="cubo"
          >
            Verlo en la sala del Museo Virtual
          </EnlaceBoton>
          {objeto.evidencias.length > 0 && (
            <Bloque titulo="Evidencias">
              <GaleriaDeEvidencias evidencias={objeto.evidencias} />
            </Bloque>
          )}
        </article>
      </Contenedor>
    </>
  )
}

function Bloque({ titulo, children }) {
  return (
    <section>
      <h2 className="mb-2 text-2xl font-semibold">{titulo}</h2>
      {children}
    </section>
  )
}

function Dato({ etiqueta, children }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-tarjeta">
      <dt className="text-xs font-semibold tracking-wider text-tinta-suave uppercase">
        {etiqueta}
      </dt>
      <dd className="mt-1">{children}</dd>
    </div>
  )
}
