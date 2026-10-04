import { describe, expect, it } from 'vitest'
import { aCargaUtil, validarVisitante, VISITANTE_VACIO } from './validacion.js'

const valido = {
  ...VISITANTE_VACIO,
  nombre: 'Ana Pérez',
  correo: 'ana@example.com',
  mensaje: 'Quiero visitar el museo',
  consentimiento_datos: true,
}

describe('validarVisitante', () => {
  it('acepta un contacto completo', () => {
    expect(validarVisitante(valido, { exigeMensaje: true })).toEqual({})
  })

  it('reporta cada campo obligatorio que falta', () => {
    const errores = validarVisitante(VISITANTE_VACIO, { exigeMensaje: true })

    expect(Object.keys(errores).sort()).toEqual([
      'consentimiento_datos',
      'correo',
      'mensaje',
      'nombre',
    ])
  })

  it('no exige mensaje en el libro de visitas', () => {
    expect(validarVisitante({ ...valido, mensaje: '' }, { exigeMensaje: false })).toEqual({})
  })

  it('rechaza correos mal formados y textos demasiado largos', () => {
    const errores = validarVisitante(
      { ...valido, correo: 'ana@', rol: 'x'.repeat(81) },
      { exigeMensaje: true },
    )

    expect(errores.correo).toMatch(/correo válido/)
    expect(errores.rol).toBe('Máximo 80 caracteres.')
  })

  it('ignora los espacios al validar el nombre', () => {
    expect(
      validarVisitante({ ...valido, nombre: '  A  ' }, { exigeMensaje: true }).nombre,
    ).toBeTruthy()
  })
})

describe('aCargaUtil', () => {
  it('limpia espacios, omite opcionales vacíos y agrega el origen', () => {
    expect(aCargaUtil({ ...valido, nombre: ' Ana ', institucion: '   ' }, 'contacto')).toEqual({
      origen: 'contacto',
      consentimiento_datos: true,
      nombre: 'Ana',
      correo: 'ana@example.com',
      mensaje: 'Quiero visitar el museo',
    })
  })
})
