import { afterEach, describe, expect, it, vi } from 'vitest'
import { cargarAframe, registrarComponentes, reiniciarCargaDeAframe } from './aframe.js'
import { LIMITES } from './sala.js'

function aframeFalso() {
  const components = {}
  return {
    components,
    registerComponent: vi.fn((nombre, definicion) => {
      components[nombre] = definicion
    }),
  }
}

afterEach(() => reiniciarCargaDeAframe())

describe('cargarAframe', () => {
  it('importa A-Frame una sola vez y registra los componentes de la sala', async () => {
    const AFRAME = aframeFalso()
    const importar = vi.fn().mockResolvedValue({ default: AFRAME })

    await cargarAframe(importar)
    await cargarAframe(importar)

    expect(importar).toHaveBeenCalledOnce()
    expect(Object.keys(AFRAME.components)).toEqual(['limites-de-sala', 'girar-con-arrastre'])
  })
})

describe('componentes', () => {
  it('no vuelve a registrar un componente existente', () => {
    const AFRAME = aframeFalso()

    registrarComponentes(AFRAME)
    registrarComponentes(AFRAME)

    expect(AFRAME.registerComponent).toHaveBeenCalledTimes(2)
  })

  it('limites-de-sala devuelve la cámara al interior de la sala', () => {
    const AFRAME = aframeFalso()
    registrarComponentes(AFRAME)
    const camara = {
      object3D: { position: { x: 40, z: 0 } },
      parentNode: { object3D: { position: { x: 1, z: -2 } } },
    }

    AFRAME.components['limites-de-sala'].tick.call({ el: camara })

    expect(camara.object3D.position.x + 1).toBe(LIMITES.maxX)
    expect(camara.object3D.position.z).toBe(0)
  })

  it('girar-con-arrastre rota el modelo y detiene el giro automático', () => {
    const AFRAME = aframeFalso()
    registrarComponentes(AFRAME)
    const escena = new EventTarget()
    const modelo = {
      sceneEl: escena,
      object3D: { rotation: { y: 0 } },
      removeAttribute: vi.fn(),
    }
    const instancia = { el: modelo, data: { sensibilidad: 0.5 } }
    const componente = AFRAME.components['girar-con-arrastre']

    componente.init.call(instancia)
    escena.dispatchEvent(Object.assign(new Event('pointerdown'), { clientX: 100 }))
    window.dispatchEvent(Object.assign(new Event('pointermove'), { clientX: 280 }))
    window.dispatchEvent(new Event('pointerup'))
    window.dispatchEvent(Object.assign(new Event('pointermove'), { clientX: 900 }))
    componente.remove.call(instancia)

    expect(modelo.removeAttribute).toHaveBeenCalledWith('animation')
    expect((modelo.object3D.rotation.y * 180) / Math.PI).toBeCloseTo(90)
  })
})
