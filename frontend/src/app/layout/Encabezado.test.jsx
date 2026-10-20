import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { RUTAS } from '@/app/navegacion.js'
import { instalarApiFalsa } from '@/test/apiFalsa.js'
import { renderRoute } from '@/test/renderRoute.jsx'

beforeEach(() => instalarApiFalsa())

describe('encabezado', () => {
  it('la navegación lateral agrupa las secciones y marca la página actual', () => {
    renderRoute(RUTAS.publicacionForo(3))
    const menu = screen.getByRole('navigation', { name: 'Principal' })

    expect(within(menu).getByRole('list', { name: 'Actividades' })).toBeInTheDocument()
    expect(within(menu).getByRole('link', { name: 'Foro' })).toHaveAttribute('aria-current', 'page')
    expect(within(menu).getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
  })

  it('el menú móvil se cierra con Escape', async () => {
    renderRoute(RUTAS.contacto)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }))
    expect(screen.getByRole('navigation', { name: 'Principal (móvil)' })).toBeVisible()

    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('navigation', { name: 'Principal (móvil)' })).not.toBeInTheDocument()
  })

  it('el menú móvil se abre, lista todas las secciones y se cierra al navegar', async () => {
    const { router } = renderRoute(RUTAS.contacto)
    const boton = screen.getByRole('button', { name: 'Abrir menú' })

    await userEvent.click(boton)
    const menuMovil = screen.getByRole('navigation', { name: 'Principal (móvil)' })
    expect(within(menuMovil).getAllByRole('link')).toHaveLength(12)

    await userEvent.click(within(menuMovil).getByRole('link', { name: 'Galería' }))

    expect(router.state.location.pathname).toBe(RUTAS.galeria)
    expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('el acceso directo al Museo Virtual está siempre visible', () => {
    renderRoute(RUTAS.contacto)

    expect(
      within(screen.getByRole('banner')).getByRole('link', { name: 'Museo Virtual' }),
    ).toHaveAttribute('href', RUTAS.museoVirtual)
  })
})

describe('precarga', () => {
  it('pide los datos de una sección al apuntar su enlace, antes de entrar', async () => {
    const { peticiones } = instalarApiFalsa()
    renderRoute(RUTAS.contacto)
    const menu = screen.getByRole('navigation', { name: 'Principal' })

    await userEvent.hover(within(menu).getByRole('link', { name: 'Salidas pedagógicas' }))

    await waitFor(() =>
      expect(peticiones.map((p) => [p.ruta, p.params.tipo])).toContainEqual([
        'actividades',
        'salida_pedagogica',
      ]),
    )
  })
})
