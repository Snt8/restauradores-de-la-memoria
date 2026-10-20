import { useQuery } from '@tanstack/react-query'
import { PAGINAS } from '@/app/navegacion.js'
import { GaleriaDeEvidencias } from '@/entities/evidencia/GaleriaDeEvidencias.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { EnEstaPagina } from '@/shared/ui/EnEstaPagina.jsx'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { CLASE_TARJETA } from '@/shared/ui/estilos.js'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { ImagenResponsiva } from '@/shared/ui/ImagenResponsiva.jsx'
import { PlantillaDePagina } from '@/shared/ui/PlantillaDePagina.jsx'
import { PortadaDePagina } from '@/shared/ui/PortadaDePagina.jsx'

const idDe = (aliado) => `aliado-${aliado.slug}`

export function AlianzasPage() {
  const consulta = useQuery(recursos.aliados.lista())
  const elementos = consulta.data?.elementos ?? []

  return (
    <PlantillaDePagina
      portada={
        <PortadaDePagina
          antetitulo="El proyecto"
          titulo={PAGINAS.alianzas.etiqueta}
          descripcion="Entidades públicas, museos e instituciones educativas que acompañan, forman y reconocen el trabajo de Restauradores de la Memoria."
          icono={PAGINAS.alianzas.icono}
          tono="cielo"
        />
      }
      panel={
        elementos.length > 0 && (
          <EnEstaPagina
            titulo="Aliados"
            secciones={elementos.map((aliado) => ({ id: idDe(aliado), etiqueta: aliado.nombre }))}
          />
        )
      }
    >
      <EstadoDeConsulta consulta={consulta}>
        {({ elementos: aliados }) => (
          <ul className="space-y-4">
            {aliados.map((aliado) => (
              <li key={aliado.id}>
                <Aliado aliado={aliado} />
              </li>
            ))}
          </ul>
        )}
      </EstadoDeConsulta>
    </PlantillaDePagina>
  )
}

function Aliado({ aliado }) {
  return (
    <article
      id={idDe(aliado)}
      className={`${CLASE_TARJETA} grid scroll-mt-24 gap-5 p-5 sm:grid-cols-[9rem_1fr] sm:gap-6 sm:p-6`}
    >
      <div className="flex h-28 items-center justify-center rounded-lg border border-linea bg-white p-3 sm:h-32">
        {aliado.logo_url ? (
          <ImagenResponsiva
            url={aliado.logo_url}
            alt={`Logo de ${aliado.nombre}`}
            sizes="9rem"
            className="max-h-full w-auto object-contain"
          />
        ) : (
          <span className="text-center font-display text-lg">{aliado.nombre}</span>
        )}
      </div>
      <div className="min-w-0 space-y-3">
        {aliado.tipo && <p className="text-sm font-semibold text-memoria">{aliado.tipo}</p>}
        <h2 className="font-sans text-xl leading-snug font-semibold">{aliado.nombre}</h2>
        {aliado.descripcion && (
          <p className="max-w-lectura leading-relaxed text-tinta-suave">{aliado.descripcion}</p>
        )}
        {aliado.sitio_web && (
          <EnlaceBoton href={aliado.sitio_web} variante="secundario" icono="enlace-externo">
            Sitio web
          </EnlaceBoton>
        )}
        <GaleriaDeEvidencias evidencias={aliado.evidencias} />
      </div>
    </article>
  )
}
