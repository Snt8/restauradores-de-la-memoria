import { useRef } from 'react'
import { PROYECTO } from '@/content/sitio.js'
import { miniaturaDeImagen, urlPublica } from '@/shared/api/media.js'
import { useEventoAframe } from './hooks.js'
import { SALA, tamanoDeCuadro, vec3 } from './sala.js'

const COLORES = {
  piso: '#2a2724',
  muro: '#f1e9da',
  techo: '#1b1916',
  zocalo: '#176b6b',
  marco: '#141311',
  pedestal: '#faf6ee',
  seleccion: '#f2c230',
}

const SELECCIONABLE = 'interactivo'

/**
 * Sala del Museo Virtual. Todo lo que contiene sale de la base de datos: los objetos
 * con su modelo 3D y su ubicación, y los cuadros con fotografías de las exposiciones.
 * Agregar un objeto o una foto no requiere tocar este componente.
 */
export function EscenaMuseo({
  objetos,
  cuadros,
  proporciones,
  seleccionado,
  escenaRef,
  rigRef,
  camaraRef,
  onSeleccionarObjeto,
  onAbrirCuadro,
}) {
  return (
    <a-scene
      ref={escenaRef}
      embedded
      className="block size-full"
      renderer="antialias: true; colorManagement: true; maxCanvasWidth: 1920; maxCanvasHeight: 1920"
      vr-mode-ui="enabled: true"
      loading-screen="dotsColor: #f2c230; backgroundColor: #141311"
      cursor="rayOrigin: mouse; fuse: false"
      raycaster={`objects: .${SELECCIONABLE}; far: 30`}
      background={`color: ${COLORES.techo}`}
    >
      <Arquitectura />

      {cuadros.map((cuadro, indice) => (
        <Cuadro
          key={cuadro.evidencia.id}
          cuadro={cuadro}
          proporcion={proporciones[cuadro.evidencia.url]}
          onAbrir={() => onAbrirCuadro(indice)}
        />
      ))}

      {objetos.map((objeto) => (
        <Pieza
          key={objeto.id}
          objeto={objeto}
          seleccionada={objeto.slug === seleccionado}
          onSeleccionar={() => onSeleccionarObjeto(objeto.slug)}
        />
      ))}

      <a-entity ref={rigRef} id="rig" position={vec3({ x: SALA.inicio.x, z: SALA.inicio.z })}>
        <a-entity
          ref={camaraRef}
          camera=""
          position={vec3({ y: SALA.alturaOjos })}
          look-controls="pointerLockEnabled: false; magicWindowTrackingEnabled: true"
          wasd-controls="acceleration: 22"
          limites-de-sala=""
        />
        <a-entity laser-controls="hand: right" raycaster={`objects: .${SELECCIONABLE}; far: 25`} />
      </a-entity>
    </a-scene>
  )
}

function Arquitectura() {
  const { ancho, fondo, alto, entradaZ } = SALA
  const centroZ = entradaZ - fondo / 2
  const muros = [
    { x: -ancho / 2, z: centroZ, rotacion: 90, largo: fondo },
    { x: ancho / 2, z: centroZ, rotacion: -90, largo: fondo },
    { x: 0, z: entradaZ - fondo, rotacion: 0, largo: ancho },
    { x: 0, z: entradaZ, rotacion: 180, largo: ancho },
  ]

  return (
    <>
      <a-plane
        rotation="-90 0 0"
        width={ancho}
        height={fondo}
        position={vec3({ z: centroZ })}
        material={`color: ${COLORES.piso}; roughness: 0.85`}
      />
      <a-plane
        rotation="90 0 0"
        width={ancho}
        height={fondo}
        position={vec3({ y: alto, z: centroZ })}
        material={`color: ${COLORES.techo}`}
      />
      {muros.map((muro) => (
        <a-entity
          key={muro.rotacion}
          position={vec3({ x: muro.x, z: muro.z })}
          rotation={`0 ${muro.rotacion} 0`}
        >
          <a-plane
            width={muro.largo}
            height={alto}
            position={vec3({ y: alto / 2 })}
            material={`color: ${COLORES.muro}; roughness: 1`}
          />
          <a-plane
            width={muro.largo}
            height="0.3"
            position={vec3({ y: 0.15, z: 0.01 })}
            material={`color: ${COLORES.zocalo}`}
          />
        </a-entity>
      ))}
      <a-image
        src={miniaturaDeImagen(PROYECTO.escudo)}
        width="0.9"
        height="0.83"
        position={vec3({ y: 3.3, z: entradaZ - fondo + 0.06 })}
        material="shader: flat; transparent: true"
      />
      <a-entity light="type: hemisphere; color: #fff7e8; groundColor: #3a332c; intensity: 1.6" />
      <a-entity light="type: directional; color: #ffffff; intensity: 0.8" position="-3 6 3" />
    </>
  )
}

function Cuadro({ cuadro, proporcion, onAbrir }) {
  const imagen = useRef(null)
  useEventoAframe(imagen, 'click', onAbrir)
  const { ancho, alto } = tamanoDeCuadro(proporcion)

  return (
    <a-entity position={vec3(cuadro.posicion)} rotation={`0 ${cuadro.rotacionY} 0`}>
      <a-plane
        width={ancho + 0.12}
        height={alto + 0.12}
        position="0 0 0.005"
        material={`color: ${COLORES.marco}`}
      />
      {/* La versión pequeña basta para el muro y ahorra memoria de video en celulares. */}
      <a-image
        ref={imagen}
        className={SELECCIONABLE}
        src={miniaturaDeImagen(cuadro.evidencia.url)}
        width={ancho}
        height={alto}
        position="0 0 0.012"
        material="shader: flat; transparent: true"
        data-titulo={cuadro.evidencia.titulo}
      />
    </a-entity>
  )
}

function Pieza({ objeto, seleccionada, onSeleccionar }) {
  const pedestal = useRef(null)
  const modelo = useRef(null)
  useEventoAframe(pedestal, 'click', onSeleccionar)
  useEventoAframe(modelo, 'click', onSeleccionar)
  const { x, y, z, rotacion_y: rotacionY, escala } = objeto.ubicacion

  return (
    <a-entity position={vec3({ x, z })} data-objeto={objeto.slug}>
      <a-box
        ref={pedestal}
        className={SELECCIONABLE}
        width="0.7"
        depth="0.7"
        height={y - 0.02}
        position={vec3({ y: (y - 0.02) / 2 })}
        material={`color: ${COLORES.pedestal}; roughness: 0.6`}
      />
      <a-ring
        radius-inner="0.42"
        radius-outer="0.5"
        rotation="-90 0 0"
        position={vec3({ y: 0.01 })}
        material={`color: ${COLORES.seleccion}; shader: flat`}
        visible={String(seleccionada)}
      />
      {objeto.modelo_3d_url && (
        <a-entity
          ref={modelo}
          className={SELECCIONABLE}
          gltf-model={`url(${urlPublica(objeto.modelo_3d_url)})`}
          position={vec3({ y })}
          rotation={`0 ${rotacionY} 0`}
          scale={`${escala} ${escala} ${escala}`}
          animation={
            seleccionada
              ? `property: rotation; to: 0 ${rotacionY + 360} 0; dur: 14000; loop: true; easing: linear`
              : undefined
          }
        />
      )}
      <a-entity
        light="type: spot; angle: 30; penumbra: 0.5; intensity: 18; distance: 8; decay: 1.5; color: #fff1d6"
        position={vec3({ y: SALA.alto - 0.3 })}
        rotation="-90 0 0"
      />
    </a-entity>
  )
}
