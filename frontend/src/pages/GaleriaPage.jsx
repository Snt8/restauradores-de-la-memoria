import { PAGINAS } from '@/app/navegacion.js'
import { GaleriaMultimedia } from '@/features/galeria/GaleriaMultimedia.jsx'
import { PlantillaDePagina } from '@/shared/ui/PlantillaDePagina.jsx'
import { PortadaDePagina } from '@/shared/ui/PortadaDePagina.jsx'

/** Galería sin panel derecho: las miniaturas aprovechan todo el ancho. */
export function GaleriaPage() {
  return (
    <PlantillaDePagina
      portada={
        <PortadaDePagina
          antetitulo="Archivo"
          titulo={PAGINAS.galeria.etiqueta}
          descripcion="Fotografías, videos, audios y enlaces del proyecto: actividades, eventos, salidas pedagógicas, ediciones del museo y evidencias históricas. Filtra por sección o por tipo de medio."
          icono={PAGINAS.galeria.icono}
          tono="cielo"
        />
      }
    >
      <GaleriaMultimedia />
    </PlantillaDePagina>
  )
}
