import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MENU, RUTAS } from '@/app/navegacion.js'
import { instalarApiFalsa, pagina } from '@/test/apiFalsa.js'
import { renderRoute } from '@/test/renderRoute.jsx'

const COLECCIONES = [
  'exposiciones',
  'objetos',
  'eventos',
  'actividades',
  'reconocimientos',
  'aliados',
  'galeria',
]

beforeEach(() => {
  instalarApiFalsa(Object.fromEntries(COLECCIONES.map((ruta) => [ruta, pagina([])])))
})

describe('enrutamiento de la aplicación', () => {
  it('muestra la página de inicio dentro del layout base', async () => {
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

  it.each(
    MENU.flatMap((entrada) => entrada.paginas ?? [])
      .concat(
        { ruta: RUTAS.queEs, etiqueta: '¿Qué es Restauradores de la Memoria?' },
        { ruta: RUTAS.reconocimientos, etiqueta: 'Reconocimientos' },
        { ruta: RUTAS.alianzas, etiqueta: 'Alianzas Institucionales' },
        { ruta: RUTAS.galeria, etiqueta: 'Galería Multimedia' },
        { ruta: RUTAS.contacto, etiqueta: 'Contacto' },
      )
      .filter((p) => p.ruta !== RUTAS.museoVirtual),
  )('la ruta $ruta muestra su título «$etiqueta»', ({ ruta, etiqueta }) => {
    renderRoute(ruta)

    expect(screen.getByRole('heading', { level: 1, name: etiqueta })).toBeInTheDocument()
    expect(document.title).toContain(etiqueta)
  })

  it('navega entre secciones desde el menú principal', async () => {
    const { router } = renderRoute('/')
    const menu = screen.getByRole('navigation', { name: 'Principal' })

    await userEvent.click(within(menu).getByRole('button', { name: 'Actividades' }))
    await userEvent.click(within(menu).getByRole('link', { name: /Fechas Conmemorativas/ }))

    expect(router.state.location.pathname).toBe(RUTAS.fechas)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Fechas Conmemorativas' }),
    ).toBeInTheDocument()
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
