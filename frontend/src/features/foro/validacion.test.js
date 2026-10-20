import { describe, expect, it } from 'vitest'
import { recortar, validarComentario, validarPublicacion } from './validacion.js'

const publicacion = {
  categoria: 'museo',
  titulo: '¿Qué objeto les impactó más?',
  contenido: 'Yo elijo el altar.',
  autor: 'Ana',
}

describe('validarPublicacion', () => {
  it('acepta una publicación completa', () => {
    expect(validarPublicacion(publicacion)).toEqual({})
  })

  it('reporta cada campo que falta', () => {
    const errores = validarPublicacion({ categoria: '', titulo: '', contenido: ' ', autor: '' })

    expect(Object.keys(errores).sort()).toEqual(['autor', 'categoria', 'contenido', 'titulo'])
  })

  it('aplica los límites de la API ignorando los espacios', () => {
    const errores = validarPublicacion({
      ...publicacion,
      titulo: '  Hola  ',
      contenido: 'x'.repeat(10_001),
    })

    expect(errores.titulo).toMatch(/al menos 5/)
    expect(errores.contenido).toBe('Máximo 10.000 caracteres.')
  })
})

describe('validarComentario', () => {
  it('exige contenido y firma', () => {
    expect(validarComentario({ contenido: '', autor: 'A' })).toEqual({
      contenido: 'Escribe tu comentario antes de enviarlo.',
      autor: 'Escribe cómo quieres firmar (mínimo 2 caracteres).',
    })
  })
})

describe('recortar', () => {
  it('quita los espacios de los textos y conserva el resto', () => {
    expect(recortar({ titulo: ' Hola ', padre_id: 3 })).toEqual({ titulo: 'Hola', padre_id: 3 })
  })
})
