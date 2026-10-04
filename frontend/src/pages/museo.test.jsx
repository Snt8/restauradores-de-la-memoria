import { fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RUTAS } from '@/app/navegacion.js'
import { instalarApiFalsa, pagina, respuestaJson } from '@/test/apiFalsa.js'
import { evidencia, exposicion, objeto } from '@/test/fixtures.js'
import { renderRoute } from '@/test/renderRoute.jsx'

// jsdom no tiene WebGL: A-Frame se reemplaza por un registro de componentes vacío.
// Los elementos <a-*> se dibujan igual, así se verifica qué arma la escena y cómo reacciona.
vi.mock('aframe', () => ({ default: { components: {}, registerComponent: vi.fn() } }))

const caja = objeto({
  slug: 'caja',
  nombre: 'Caja de archivo',
  orden: 1,
  modelo_3d_url: 'models/pieza-prueba-caja.glb',
  ubicacion: { x: -2.2, y: 1.05, z: -5, rotacion_y: 20, escala: 1.6 },
})
const vasija = objeto({
  slug: 'vasija',
  nombre: 'Vasija',
  orden: 2,
  modelo_3d_url: 'models/pieza-prueba-vasija.glb',
  ubicacion: { x: 2.2, y: 1.05, z: -5, rotacion_y: -20, escala: 1.6 },
})
const edicion2025 = exposicion({
  nombre: 'Museo Escolar 2025',
  evidencias: [
    evidencia({ titulo: 'Altar de la sanación', url: 'media/museo/2025-altar-sanacion' }),
    evidencia({ titulo: 'Danza', url: 'media/museo/2025-danza' }),
  ],
})

function api(extra = {}) {
  return instalarApiFalsa({
    objetos: pagina([vasija, caja]),
    exposiciones: pagina([edicion2025]),
    ...extra,
  })
}

async function abrirMuseo(ruta = RUTAS.museoVirtual) {
  const resultado = renderRoute(ruta)
  await screen.findByRole('heading', { level: 1, name: 'Museo Virtual' })
  await screen.findByRole('navigation', { name: 'Objetos de la sala' })
  return { ...resultado, escena: document.querySelector('a-scene') }
}

describe('Museo Virtual', () => {
  it('arma la sala desde la API: un pedestal y un modelo por objeto, y cuadros con fotos', async () => {
    api()
    const { escena } = await abrirMuseo()

    const piezas = escena.querySelectorAll('[data-objeto]')
    expect([...piezas].map((p) => p.dataset.objeto)).toEqual(['vasija', 'caja'])
    const modelo = escena.querySelector('[data-objeto="caja"] [gltf-model]')
    expect(modelo.getAttribute('gltf-model')).toBe('url(/models/pieza-prueba-caja.glb)')
    expect(modelo.getAttribute('scale')).toBe('1.6 1.6 1.6')

    const cuadros = escena.querySelectorAll('a-image.interactivo')
    expect([...cuadros].map((c) => c.dataset.titulo)).toEqual(['Altar de la sanación', 'Danza'])
    expect(cuadros[0].getAttribute('src')).toBe('/media/museo/2025-altar-sanacion-sm.webp')
  })

  it('al hacer clic en un pedestal muestra la ficha del objeto y la guarda en la URL', async () => {
    api()
    const { escena, router } = await abrirMuseo()

    fireEvent.click(escena.querySelector('[data-objeto="caja"] a-box'))

    const panel = await screen.findByRole('complementary', {
      name: 'Información de Caja de archivo',
    })
    expect(within(panel).getByRole('link', { name: /Ver la ficha completa/ })).toHaveAttribute(
      'href',
      RUTAS.objeto('caja'),
    )
    expect(router.state.location.search).toBe('?objeto=caja')
    expect(escena.querySelector('[data-objeto="caja"] a-ring').getAttribute('visible')).toBe('true')

    await userEvent.click(within(panel).getByRole('button', { name: /Cerrar/ }))
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })

  it('la visita guiada recorre las piezas en orden y mueve la cámara frente a cada una', async () => {
    api()
    const { escena } = await abrirMuseo()
    const rig = escena.querySelector('#rig')

    await userEvent.click(screen.getByRole('button', { name: /Comenzar la visita/ }))

    expect(screen.getByText('Parada 1 de 2: Caja de archivo')).toBeInTheDocument()
    expect(rig.getAttribute('animation__recorrido')).toContain('to: -1.85 0 -2.8')

    await userEvent.click(screen.getByRole('button', { name: /Siguiente pieza/ }))

    expect(screen.getByText('Parada 2 de 2: Vasija')).toBeInTheDocument()
    expect(rig.getAttribute('animation__recorrido')).toContain('to: 1.85 0 -2.8')
    expect(screen.getByRole('button', { name: /Siguiente pieza/ })).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: 'Volver a la entrada' }))
    expect(rig.getAttribute('animation__recorrido')).toContain('to: 0 0 1')
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })

  it('ofrece una lista accesible de los objetos como alternativa a la escena 3D', async () => {
    api()
    await abrirMuseo()
    const lista = screen.getByRole('navigation', { name: 'Objetos de la sala' })

    await userEvent.click(within(lista).getByRole('button', { name: 'Vasija' }))

    expect(within(lista).getByRole('button', { name: 'Vasija' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByRole('complementary', { name: 'Información de Vasija' })).toBeInTheDocument()
  })

  it('abre las fotografías de los muros en el visor', async () => {
    api()
    const { escena } = await abrirMuseo()

    fireEvent.click(escena.querySelector('a-image[data-titulo="Danza"]'))

    expect(
      await screen.findByRole('dialog', { name: 'Danza · Museo Escolar 2025' }),
    ).toBeInTheDocument()
  })

  it('un enlace con ?objeto= abre la sala con ese objeto seleccionado', async () => {
    api()
    await abrirMuseo(`${RUTAS.museoVirtual}?objeto=vasija`)

    expect(screen.getByRole('complementary', { name: 'Información de Vasija' })).toBeInTheDocument()
  })

  it('avisa si la sala todavía no tiene objetos', async () => {
    api({ objetos: pagina([]) })
    renderRoute(RUTAS.museoVirtual)

    expect(
      await screen.findByText('La sala todavía no tiene objetos publicados.'),
    ).toBeInTheDocument()
  })

  it('permite firmar el libro de visitas sin escribir mensaje', async () => {
    const { peticiones } = api({
      'POST visitantes': respuestaJson({ id: 7, creado_en: '2026-10-03T00:00:00Z' }, 201),
    })
    await abrirMuseo()

    await userEvent.type(screen.getByLabelText(/^Nombre/), 'Luis')
    await userEvent.type(screen.getByLabelText(/^Correo electrónico/), 'luis@example.com')
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(screen.getByRole('button', { name: 'Firmar el libro de visitas' }))

    expect(await screen.findByRole('status', { name: '' })).toHaveTextContent(
      'Tu firma quedó registrada',
    )
    expect(peticiones.find((p) => p.metodo === 'POST').cuerpo).toEqual({
      origen: 'libro_visitas',
      nombre: 'Luis',
      correo: 'luis@example.com',
      consentimiento_datos: true,
    })
  })
})

describe('Ficha de un objeto', () => {
  it('muestra el modelo 3D, la descripción, la importancia, los créditos y el acceso a la sala', async () => {
    instalarApiFalsa({ 'objetos/caja': caja })
    renderRoute(RUTAS.objeto('caja'))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Caja de archivo' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Importancia para la memoria' })).toBeInTheDocument()
    expect(screen.getByText(caja.creditos)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Verlo en la sala/ })).toHaveAttribute(
      'href',
      `${RUTAS.museoVirtual}?objeto=caja`,
    )

    const figura = await screen.findByText(/Arrastra para girarlo/)
    const modelo = figura.closest('figure').querySelector('[gltf-model]')
    expect(modelo).toHaveAttribute('girar-con-arrastre')
    expect(modelo.getAttribute('gltf-model')).toBe('url(/models/pieza-prueba-caja.glb)')
  })

  it('muestra la página 404 si el objeto no existe', async () => {
    instalarApiFalsa()
    renderRoute(RUTAS.objeto('no-existe'))

    expect(await screen.findByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument()
  })
})
