import { useQuery } from '@tanstack/react-query'
import { PAGINAS } from '@/app/navegacion.js'
import { GaleriaDeEvidencias } from '@/entities/evidencia/GaleriaDeEvidencias.jsx'
import { recursos } from '@/shared/api/recursos.js'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { EncabezadoDePagina } from '@/shared/ui/EncabezadoDePagina.jsx'
import { EnlaceBoton } from '@/shared/ui/EnlaceBoton.jsx'
import { EstadoDeConsulta } from '@/shared/ui/EstadoDeConsulta.jsx'
import { ImagenResponsiva } from '@/shared/ui/ImagenResponsiva.jsx'

export function AlianzasPage() {
  const consulta = useQuery(recursos.aliados.lista())

  return (
    <>
      <EncabezadoDePagina
        antetitulo="Trayectoria"
        titulo={PAGINAS.alianzas.etiqueta}
        entradilla="Entidades públicas, museos e instituciones educativas que acompañan, forman y reconocen el trabajo de Restauradores de la Memoria."
      />
      <Contenedor className="py-12">
        <EstadoDeConsulta consulta={consulta}>
          {({ elementos }) => (
            <ul className="space-y-6">
              {elementos.map((aliado) => (
                <li key={aliado.id}>
                  <Aliado aliado={aliado} />
                </li>
              ))}
            </ul>
          )}
        </EstadoDeConsulta>
      </Contenedor>
    </>
  )
}

function Aliado({ aliado }) {
  return (
    <article className="grid gap-6 rounded-tarjeta bg-white p-6 shadow-tarjeta md:grid-cols-[12rem_1fr]">
      <div className="flex h-32 items-center justify-center rounded-lg border border-linea bg-white p-4">
        {aliado.logo_url ? (
          <ImagenResponsiva
            url={aliado.logo_url}
            alt={`Logo de ${aliado.nombre}`}
            sizes="12rem"
            className="max-h-full w-auto object-contain"
          />
        ) : (
          <span className="text-center font-display text-lg">{aliado.nombre}</span>
        )}
      </div>
      <div className="space-y-3">
        {aliado.tipo && <p className="text-sm font-semibold text-memoria">{aliado.tipo}</p>}
        <h2 className="text-2xl font-semibold">{aliado.nombre}</h2>
        {aliado.descripcion && <p className="text-tinta-suave">{aliado.descripcion}</p>}
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
