import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '@/test/renderRoute.jsx'

describe('enrutamiento de la aplicación', () => {
  it('muestra la página de inicio dentro del layout base', () => {
    renderRoute('/')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Restauradores de la Memoria' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Colegio Tom Adams IED')
  })

  it('ofrece un enlace para saltar al contenido principal', () => {
    renderRoute('/')

    const skipLink = screen.getByRole('link', { name: 'Saltar al contenido principal' })
    expect(skipLink).toHaveAttribute('href', `#${screen.getByRole('main').id}`)
  })

  it('muestra la página 404 en rutas inexistentes y permite volver al inicio', async () => {
    const { router } = renderRoute('/ruta-que-no-existe')

    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: 'Volver al inicio' }))

    expect(router.state.location.pathname).toBe('/')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Restauradores de la Memoria' }),
    ).toBeInTheDocument()
  })
})
