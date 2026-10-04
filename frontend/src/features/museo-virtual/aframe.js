import { LIMITES, limitarPosicion, rotacionTrasArrastre } from './sala.js'

/**
 * Carga A-Frame (≈1 MB) solo cuando el visitante abre el museo, una única vez,
 * y registra los componentes propios de la sala.
 */
let carga = null

export function cargarAframe(importar = () => import('aframe')) {
  carga ??= importar().then((modulo) => {
    const AFRAME = modulo.default ?? globalThis.AFRAME
    registrarComponentes(AFRAME)
    return AFRAME
  })
  return carga
}

/** Solo para pruebas: olvida la carga para poder repetirla con otro importador. */
export function reiniciarCargaDeAframe() {
  carga = null
}

export function registrarComponentes(AFRAME) {
  if (!AFRAME.components['limites-de-sala']) {
    /**
     * Va en la cámara (hija del «rig»): impide que el visitante atraviese los muros.
     * La posición en el mundo es la del rig más la propia de la cámara.
     */
    AFRAME.registerComponent('limites-de-sala', {
      tick() {
        const local = this.el.object3D.position
        const rig = this.el.parentNode?.object3D?.position ?? { x: 0, z: 0 }
        const mundo = limitarPosicion({ x: rig.x + local.x, z: rig.z + local.z }, LIMITES)
        local.x = mundo.x - rig.x
        local.z = mundo.z - rig.z
      },
    })
  }

  if (!AFRAME.components['girar-con-arrastre']) {
    /** Va en un modelo: al arrastrar sobre la escena, el modelo gira sobre su eje. */
    AFRAME.registerComponent('girar-con-arrastre', {
      schema: { sensibilidad: { default: 0.4 } },
      init() {
        this.ultimoX = null
        this.alPresionar = (evento) => {
          this.ultimoX = evento.clientX
          this.el.removeAttribute('animation') // detiene el giro automático
        }
        this.alMover = (evento) => {
          if (this.ultimoX === null) return
          const rotacion = this.el.object3D.rotation
          const grados = rotacionTrasArrastre(
            (rotacion.y * 180) / Math.PI,
            evento.clientX - this.ultimoX,
            this.data.sensibilidad,
          )
          rotacion.y = (grados * Math.PI) / 180
          this.ultimoX = evento.clientX
        }
        this.alSoltar = () => {
          this.ultimoX = null
        }
        const lienzo = this.el.sceneEl
        lienzo.addEventListener('pointerdown', this.alPresionar)
        window.addEventListener('pointermove', this.alMover)
        window.addEventListener('pointerup', this.alSoltar)
      },
      remove() {
        this.el.sceneEl?.removeEventListener('pointerdown', this.alPresionar)
        window.removeEventListener('pointermove', this.alMover)
        window.removeEventListener('pointerup', this.alSoltar)
      },
    })
  }
}
