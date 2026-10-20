import { describe, expect, it } from 'vitest'
import { idDeVotante, nombreGuardado, recordarNombre } from './identidad.js'

function almacenFalso() {
  const datos = new Map()
  return {
    getItem: (clave) => datos.get(clave) ?? null,
    setItem: (clave, valor) => datos.set(clave, valor),
  }
}

const almacenBloqueado = {
  getItem: () => {
    throw new Error('SecurityError')
  },
  setItem: () => {
    throw new Error('SecurityError')
  },
}

describe('idDeVotante', () => {
  it('crea un UUID una sola vez y lo conserva', () => {
    const almacen = almacenFalso()
    const id = idDeVotante(almacen)

    expect(id).toMatch(/^[0-9a-f-]{36}$/)
    expect(idDeVotante(almacen)).toBe(id)
  })

  it('reemplaza un valor guardado que no es un UUID', () => {
    const almacen = almacenFalso()
    almacen.setItem('restauradores:foro:votante', 'manipulado')

    expect(idDeVotante(almacen)).not.toBe('manipulado')
  })

  it('funciona aunque el navegador bloquee el almacenamiento', () => {
    const id = idDeVotante(almacenBloqueado)

    expect(idDeVotante(almacenBloqueado)).toBe(id)
  })
})

describe('nombre del autor', () => {
  it('no recupera un nombre que ya se borró del almacenamiento', () => {
    const almacen = almacenFalso()
    recordarNombre('Ana', almacen)

    expect(nombreGuardado(almacenFalso())).toBe('')
  })

  it('recuerda el último nombre usado', () => {
    const almacen = almacenFalso()

    expect(nombreGuardado(almacen)).toBe('')
    recordarNombre('Ana', almacen)
    expect(nombreGuardado(almacen)).toBe('Ana')
  })
})
