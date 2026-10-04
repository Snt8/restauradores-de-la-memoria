import { act, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EstadoDeConsulta } from './EstadoDeConsulta.jsx'
import { FiltroDeOpciones } from './FiltroDeOpciones.jsx'
import { useNavegacionEnLista } from './useNavegacionEnLista.js'
import { Visor } from './Visor.jsx'

describe('EstadoDeConsulta', () => {
  const contenido = (datos) => <p>{datos.elementos.length} elementos</p>

  it('muestra un estado de carga accesible mientras la consulta está pendiente', () => {
    render(<EstadoDeConsulta consulta={{ isPending: true }}>{contenido}</EstadoDeConsulta>)

    expect(screen.getByRole('status')).toHaveTextContent('Cargando contenido…')
  })

  it('explica el error y permite reintentar', async () => {
    const refetch = vi.fn()
    render(
      <EstadoDeConsulta consulta={{ isError: true, error: { status: 0 }, refetch }}>
        {contenido}
      </EstadoDeConsulta>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Revisa tu conexión')
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(refetch).toHaveBeenCalledOnce()
  })

  it('muestra el mensaje de vacío cuando no hay elementos', () => {
    render(
      <EstadoDeConsulta consulta={{ data: { elementos: [] } }} vacio="Nada por aquí">
        {contenido}
      </EstadoDeConsulta>,
    )

    expect(screen.getByText('Nada por aquí')).toBeInTheDocument()
  })

  it('entrega los datos al contenido cuando la consulta tuvo éxito', () => {
    render(
      <EstadoDeConsulta consulta={{ data: { elementos: [1, 2] } }}>{contenido}</EstadoDeConsulta>,
    )

    expect(screen.getByText('2 elementos')).toBeInTheDocument()
  })
})

describe('FiltroDeOpciones', () => {
  it('marca la opción activa y avisa el cambio', async () => {
    const onCambiar = vi.fn()
    render(
      <FiltroDeOpciones
        etiqueta="Filtrar por tipo"
        opciones={[
          { valor: null, etiqueta: 'Todo' },
          { valor: 'medios', etiqueta: 'Medios' },
        ]}
        valor={null}
        onCambiar={onCambiar}
      />,
    )

    expect(screen.getByRole('group', { name: 'Filtrar por tipo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Todo' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(screen.getByRole('button', { name: 'Medios' }))
    expect(onCambiar).toHaveBeenCalledWith('medios')
  })
})

describe('useNavegacionEnLista', () => {
  it('abre, recorre con vuelta al inicio y cierra', () => {
    const { result } = renderHook(() => useNavegacionEnLista(3))

    act(() => result.current.abrir(2))
    expect(result.current.posicion).toBe('3 de 3')
    act(() => result.current.siguiente())
    expect(result.current.indice).toBe(0)
    act(() => result.current.anterior())
    expect(result.current.indice).toBe(2)
    act(() => result.current.cerrar())
    expect(result.current.abierto).toBe(false)
  })

  it('no ofrece anterior ni siguiente con un solo elemento', () => {
    const { result } = renderHook(() => useNavegacionEnLista(1))

    expect(result.current.siguiente).toBeUndefined()
    expect(result.current.anterior).toBeUndefined()
  })
})

describe('Visor', () => {
  it('abre un diálogo con nombre y navega con botones y flechas del teclado', async () => {
    const onSiguiente = vi.fn()
    const onAnterior = vi.fn()
    const onCerrar = vi.fn()
    render(
      <Visor
        abierto
        titulo="Altar de la sanación"
        posicion="1 de 4"
        onCerrar={onCerrar}
        onAnterior={onAnterior}
        onSiguiente={onSiguiente}
      >
        <p>Contenido</p>
      </Visor>,
    )

    const dialogo = screen.getByRole('dialog', { name: 'Altar de la sanación' })
    expect(dialogo).toHaveAttribute('open')
    expect(screen.getByText('1 de 4')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
    await userEvent.keyboard('{ArrowLeft}')
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }))

    expect(onSiguiente).toHaveBeenCalledOnce()
    expect(onAnterior).toHaveBeenCalledOnce()
    expect(onCerrar).toHaveBeenCalledOnce()
  })

  it('no dibuja contenido mientras está cerrado', () => {
    render(
      <Visor abierto={false} titulo="x" onCerrar={() => {}}>
        <p>Contenido oculto</p>
      </Visor>,
    )

    expect(screen.queryByText('Contenido oculto')).not.toBeInTheDocument()
  })
})
