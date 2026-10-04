import { useEffect, useRef, useState } from 'react'
import { miniaturaDeImagen } from '@/shared/api/media.js'
import { SALA, vec3 } from './sala.js'

/**
 * Escucha un evento de un elemento de A-Frame (p. ej. el «click» que emite el cursor).
 * Se usa addEventListener porque los eventos de A-Frame no pasan por el sistema de React.
 */
export function useEventoAframe(ref, nombre, manejador) {
  const ultimo = useRef(manejador)
  useEffect(() => {
    ultimo.current = manejador
  })

  useEffect(() => {
    const elemento = ref.current
    if (!elemento) return undefined
    const escuchar = (evento) => ultimo.current(evento)
    elemento.addEventListener(nombre, escuchar)
    return () => elemento.removeEventListener(nombre, escuchar)
  }, [ref, nombre])
}

/**
 * Proporción (ancho / alto) de cada imagen, medida al cargar su versión pequeña.
 * Mientras no se conoce, el cuadro usa una proporción por defecto.
 */
export function useProporciones(urls) {
  const [proporciones, setProporciones] = useState({})
  const clave = urls.join('|')

  useEffect(() => {
    let vigente = true
    for (const url of clave ? clave.split('|') : []) {
      const imagen = new Image()
      imagen.onload = () => {
        if (!vigente || !imagen.naturalHeight) return
        setProporciones((previas) => ({
          ...previas,
          [url]: imagen.naturalWidth / imagen.naturalHeight,
        }))
      }
      imagen.src = miniaturaDeImagen(url)
    }
    return () => {
      vigente = false
    }
  }, [clave])

  return proporciones
}

const DURACION_DEL_TRASLADO = 1400

/**
 * Controla la cámara del museo: el «rig» se traslada con una animación y la cámara
 * se orienta hacia la pieza. Si A-Frame aún no inicializó look-controls, solo se traslada.
 */
export function useCamaraDelMuseo() {
  const escena = useRef(null)
  const rig = useRef(null)
  const camara = useRef(null)

  function irA({ posicion, rotacionY }) {
    rig.current?.setAttribute(
      'animation__recorrido',
      `property: position; to: ${vec3({ x: posicion.x, z: posicion.z })}; dur: ${DURACION_DEL_TRASLADO}; easing: easeInOutCubic`,
    )
    const elementoCamara = camara.current
    if (!elementoCamara) return
    elementoCamara.object3D?.position.set(0, SALA.alturaOjos, 0)
    const mirar = elementoCamara.components?.['look-controls']
    if (mirar) {
      mirar.yawObject.rotation.y = (rotacionY * Math.PI) / 180
      mirar.pitchObject.rotation.x = 0
    }
  }

  /** Ejecuta `accion` cuando la escena terminó de cargar (de inmediato si ya cargó). */
  function alCargar(accion) {
    const elemento = escena.current
    if (!elemento || elemento.hasLoaded) accion()
    else elemento.addEventListener('loaded', accion, { once: true })
  }

  return {
    escena,
    rig,
    camara,
    irA,
    alCargar,
    irALaEntrada: () => irA({ posicion: SALA.inicio, rotacionY: 0 }),
  }
}
