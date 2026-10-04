import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { evidencia, sinFecha } from '@/test/fixtures.js'
import { TarjetaDeContenido } from './TarjetaDeContenido.jsx'

describe('TarjetaDeContenido', () => {
  it('muestra título, fecha semántica, lugar, descripción y evidencias', () => {
    render(
      <TarjetaDeContenido
        titulo="Eje de la Memoria"
        fecha={{ anio: 2025, mes: 6, dia: null }}
        lugar="Bogotá"
        descripcion="Salida con el CNMH."
        evidencias={[evidencia(), evidencia()]}
      />,
    )

    expect(screen.getByRole('heading', { level: 3, name: 'Eje de la Memoria' })).toBeInTheDocument()
    expect(screen.getByText('junio de 2025')).toHaveAttribute('datetime', '2025-06')
    expect(screen.getByText('Bogotá')).toBeInTheDocument()
    expect(screen.getByText('Salida con el CNMH.')).toBeInTheDocument()
    expect(screen.getByText('Evidencias (2)')).toBeInTheDocument()
  })

  it('dice «Fecha por confirmar» en vez de inventar una fecha', () => {
    render(<TarjetaDeContenido titulo="Olla comunitaria" fecha={sinFecha()} />)

    expect(screen.getByText('Fecha por confirmar')).toBeInTheDocument()
    expect(screen.queryByText(/Evidencias/)).not.toBeInTheDocument()
  })
})
