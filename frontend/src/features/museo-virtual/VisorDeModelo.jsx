import { useQuery } from '@tanstack/react-query'
import { urlPublica } from '@/shared/api/media.js'
import { cargarAframe } from './aframe.js'

/**
 * Visor 3D individual para la ficha de un objeto: el modelo gira solo y el visitante
 * puede girarlo arrastrando. Reutiliza A-Frame (el mismo motor de la sala), así el
 * portal no suma otra librería 3D.
 */
export function VisorDeModelo({ objeto }) {
  const motor = useQuery({
    queryKey: ['aframe'],
    queryFn: () => cargarAframe(),
    staleTime: Infinity,
  })

  if (motor.isError) {
    return <Aviso>No se pudo cargar el visor 3D en este navegador.</Aviso>
  }
  if (motor.isPending) {
    return <Aviso>Cargando el modelo 3D…</Aviso>
  }

  return (
    <figure className="overflow-hidden rounded-tarjeta bg-noche">
      <div className="aspect-[4/3] w-full">
        <a-scene
          embedded
          className="block size-full"
          vr-mode-ui="enabled: false"
          loading-screen="dotsColor: #f2c230; backgroundColor: #141311"
          renderer="antialias: true; colorManagement: true"
          background="color: #2a2724"
        >
          <a-entity light="type: ambient; intensity: 0.7" />
          <a-entity light="type: directional; intensity: 0.9" position="1 3 2" />
          <a-entity
            gltf-model={`url(${urlPublica(objeto.modelo_3d_url)})`}
            position="0 0.75 0"
            scale="2.2 2.2 2.2"
            girar-con-arrastre=""
            animation="property: rotation; to: 0 360 0; dur: 16000; loop: true; easing: linear"
            data-objeto={objeto.slug}
          />
          <a-entity
            camera=""
            position="0 1.25 1.9"
            rotation="-12 0 0"
            look-controls="enabled: false"
          />
        </a-scene>
      </div>
      <figcaption className="px-4 py-3 text-sm text-white/70">
        Modelo 3D de {objeto.nombre}. Arrastra para girarlo.
      </figcaption>
    </figure>
  )
}

function Aviso({ children }) {
  return (
    <div
      role="status"
      className="flex aspect-[4/3] items-center justify-center rounded-tarjeta bg-noche p-6 text-center text-white/80"
    >
      {children}
    </div>
  )
}
