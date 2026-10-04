import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { RUTAS } from '@/app/navegacion.js'
import { instalarApiFalsa } from '@/test/apiFalsa.js'
import { renderRoute } from '@/test/renderRoute.jsx'

beforeEach(() => instalarApiFalsa())

describe('encabezado', () => {
  it('el grupo «Museo» se despliega, marca su estado y se cierra con Escape', async () => {
    renderRoute(RUTAS.contacto)
    const menu = screen.getByRole('navigation', { name: 'Principal' })
    const boton = within(menu).getByRole('button', { name: 'Museo' })

    expect(boton).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(boton)
    expect(boton).toHaveAttribute('aria-expanded', 'true')
    expect(within(menu).getByRole('link', { name: /Museo Virtual/ })).toBeVisible()

    await userEvent.keyboard('{Escape}')
    expect(boton).toHaveAttribute('aria-expanded', 'false')
    expect(boton).toHaveFocus()
  })

  it('el menú móvil se abre, lista todas las secciones y se cierra al navegar', async () => {
    const { router } = renderRoute(RUTAS.contacto)
    const boton = screen.getByRole('button', { name: 'Abrir menú' })

    await userEvent.click(boton)
    const menuMovil = screen.getByRole('navigation', { name: 'Principal (móvil)' })
    expect(within(menuMovil).getAllByRole('link')).toHaveLength(11)

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
