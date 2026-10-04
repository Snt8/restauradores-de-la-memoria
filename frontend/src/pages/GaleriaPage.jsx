import { PAGINAS } from '@/app/navegacion.js'
import { GaleriaMultimedia } from '@/features/galeria/GaleriaMultimedia.jsx'
import { Contenedor } from '@/shared/ui/Contenedor.jsx'
import { EncabezadoDePagina } from '@/shared/ui/EncabezadoDePagina.jsx'

export function GaleriaPage() {
  return (
    <>
      <EncabezadoDePagina
        antetitulo="Archivo"
        titulo={PAGINAS.galeria.etiqueta}
        entradilla="Fotografías, videos, audios y enlaces del proyecto: actividades, eventos, salidas pedagógicas, ediciones del museo y evidencias históricas. Filtra por sección o por tipo de medio."
      />
      <Contenedor className="py-12">
        <GaleriaMultimedia />
      </Contenedor>
    </>
  )
}
