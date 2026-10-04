import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { RUTAS } from '@/app/navegacion.js'
import { instalarApiFalsa, pagina, respuestaJson } from '@/test/apiFalsa.js'
import {
  actividad,
  aliado,
  elementoDeGaleria,
  evento,
  evidencia,
  exposicion,
  objeto,
  reconocimiento,
} from '@/test/fixtures.js'
import { renderRoute } from '@/test/renderRoute.jsx'

describe('Inicio', () => {
  it('presenta el proyecto, sus accesos y el contenido destacado de la API', async () => {
    instalarApiFalsa({
      exposiciones: pagina([exposicion({ nombre: 'Arte y Memoria 2026' })]),
      reconocimientos: pagina([
        reconocimiento({ nombre: 'Gala de los Mejores', otorgante: 'SED' }),
      ]),
    })
    renderRoute(RUTAS.inicio)

    expect(
      within(screen.getByRole('main')).getByText('«Voces que se resisten al silencio»'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Recorrer el Museo Virtual/ })).toHaveAttribute(
      'href',
      RUTAS.museoVirtual,
    )
    expect(await screen.findByText('Arte y Memoria 2026')).toBeInTheDocument()
    expect(await screen.findByText('Gala de los Mejores')).toBeInTheDocument()
  })
})

describe('¿Qué es?', () => {
  it('explica el proyecto y muestra la formación docente desde la API', async () => {
    const { peticiones } = instalarApiFalsa({
      actividades: pagina([
        actividad({ tipo: 'formacion', nombre: 'Diplomado en Memoria y Verdad' }),
      ]),
    })
    renderRoute(RUTAS.queEs)

    for (const titulo of [
      'Qué es',
      'Propósito',
      '¿Por qué conservar la memoria?',
      'Qué actividades desarrolla',
      'Quiénes participan',
    ]) {
      expect(screen.getByRole('heading', { level: 2, name: titulo })).toBeInTheDocument()
    }
    expect(await screen.findByText('Diplomado en Memoria y Verdad')).toBeInTheDocument()
    expect(peticiones[0].params).toMatchObject({ tipo: 'formacion' })
  })
})

describe('Museo Escolar de la Memoria', () => {
  it('muestra objetos con enlace a su ficha, ediciones y créditos', async () => {
    instalarApiFalsa({
      objetos: pagina([objeto({ slug: 'caja', nombre: 'Caja de archivo' })]),
      exposiciones: pagina([
        exposicion({ nombre: 'Museo Escolar 2021', evidencias: [evidencia()] }),
      ]),
    })
    renderRoute(RUTAS.museo)

    expect(await screen.findByRole('link', { name: 'Caja de archivo' })).toHaveAttribute(
      'href',
      RUTAS.objeto('caja'),
    )
    expect(screen.getByText('Modelo 3D disponible · fotografía pendiente')).toBeInTheDocument()
    expect(await screen.findByText('Museo Escolar 2021')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Créditos' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Entrar al Museo Virtual/ })).toBeInTheDocument()
  })
})

describe('Salidas pedagógicas', () => {
  it('agrupa las salidas por año y deja al final las que no tienen fecha', async () => {
    const { peticiones } = instalarApiFalsa({
      actividades: pagina([
        actividad({ nombre: 'Eje de la Memoria', fecha: { anio: 2025, mes: 6, dia: null } }),
        actividad({ nombre: 'Casa de la Memoria de Suba', fecha: { anio: 2024 } }),
        actividad({ nombre: 'Olla comunitaria' }),
      ]),
    })
    renderRoute(RUTAS.salidas)

    const anios = await screen.findAllByRole('heading', { level: 2 })
    expect(anios.map((h) => h.textContent)).toEqual(['2025', '2024', 'Fecha por confirmar'])
    expect(screen.getByRole('heading', { level: 3, name: 'Olla comunitaria' })).toBeInTheDocument()
    expect(peticiones[0].params).toMatchObject({ tipo: 'salida_pedagogica', limite: '100' })
  })
})

describe('Fechas conmemorativas', () => {
  it('muestra cada fecha como hoja de calendario', async () => {
    instalarApiFalsa({
      actividades: pagina([
        actividad({
          tipo: 'fecha_conmemorativa',
          nombre: 'Día Nacional de la Memoria y Solidaridad con las Víctimas',
          fecha: { anio: null, mes: 4, dia: 9 },
        }),
      ]),
    })
    renderRoute(RUTAS.fechas)

    const hoja = await screen.findByText('abril')
    expect(hoja.closest('time')).toHaveAttribute('datetime', '--04-09')
    expect(hoja.closest('time')).toHaveTextContent('9')
  })
})

describe('Visitas y eventos', () => {
  it('filtra por tipo en la API y guarda el filtro en la URL', async () => {
    const { peticiones } = instalarApiFalsa({
      eventos: ({ params }) =>
        pagina(
          params.tipo === 'medios'
            ? [evento({ tipo: 'medios', nombre: 'Entrevista en City TV' })]
            : [
                evento({ tipo: 'medios', nombre: 'Entrevista en City TV' }),
                evento({ tipo: 'visita', nombre: 'Conversatorio con MAFAPO' }),
              ],
        ),
    })
    const { router } = renderRoute(RUTAS.eventos)

    expect(await screen.findByText('2 registros')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'En los medios' }))

    expect(await screen.findByText('1 registro')).toBeInTheDocument()
    expect(router.state.location.search).toBe('?tipo=medios')
    expect(peticiones.at(-1).params).toMatchObject({ tipo: 'medios' })
    expect(screen.getByRole('button', { name: 'En los medios' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('lee el filtro inicial desde la URL e ignora valores no válidos', async () => {
    const { peticiones } = instalarApiFalsa({ eventos: pagina([]) })
    renderRoute(`${RUTAS.eventos}?tipo=inventado`)

    expect(await screen.findByText('No hay registros de este tipo todavía.')).toBeInTheDocument()
    expect(peticiones[0].params.tipo).toBeUndefined()
  })
})

describe('Reconocimientos y alianzas', () => {
  it('muestra quién otorgó cada reconocimiento', async () => {
    instalarApiFalsa({
      reconocimientos: pagina([
        reconocimiento({ nombre: 'READH', otorgante: 'Centro Nacional de Memoria Histórica' }),
      ]),
    })
    renderRoute(RUTAS.reconocimientos)

    expect(await screen.findByText('Centro Nacional de Memoria Histórica')).toBeInTheDocument()
  })

  it('muestra el logo y el sitio web de cada aliado', async () => {
    instalarApiFalsa({
      aliados: pagina([
        aliado({
          nombre: 'Museo Nacional de Colombia',
          logo_url: 'media/aliados/logo-museo-nacional',
          sitio_web: 'https://www.museonacional.gov.co',
        }),
      ]),
    })
    renderRoute(RUTAS.alianzas)

    expect(
      await screen.findByRole('img', { name: 'Logo de Museo Nacional de Colombia' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Sitio web/ })).toHaveAttribute(
      'href',
      'https://www.museonacional.gov.co',
    )
  })

  it('ofrece reintentar cuando la API falla', async () => {
    let intentos = 0
    instalarApiFalsa({
      aliados: () => {
        intentos += 1
        return intentos === 1
          ? respuestaJson({ detail: 'error' }, 500)
          : pagina([aliado({ nombre: 'ETITC' })])
      },
    })
    renderRoute(RUTAS.alianzas)

    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar')
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByRole('heading', { name: 'ETITC' })).toBeInTheDocument()
  })
})

describe('Galería multimedia', () => {
  it('filtra por sección y tipo, y carga más páginas bajo demanda', async () => {
    const { peticiones } = instalarApiFalsa({
      galeria: ({ params }) =>
        pagina(
          [
            elementoDeGaleria({
              evidencia: evidencia({ titulo: `Foto ${params.desplazamiento}` }),
              contexto: 'Festival de Arte de Kennedy',
            }),
          ],
          { total: 30, limite: 24, desplazamiento: Number(params.desplazamiento) },
        ),
    })
    const { router } = renderRoute(RUTAS.galeria)

    expect(await screen.findByText('Mostrando 1 de 30 evidencias')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Foto 0/ })).toHaveTextContent(
      'Festival de Arte de Kennedy',
    )

    await userEvent.click(screen.getByRole('button', { name: 'Cargar más evidencias' }))
    expect(await screen.findByRole('button', { name: /Foto 24/ })).toBeInTheDocument()

    const secciones = screen.getByRole('group', { name: 'Filtrar por sección' })
    await userEvent.click(within(secciones).getByRole('button', { name: 'Salidas pedagógicas' }))
    const tipos = screen.getByRole('group', { name: 'Filtrar por tipo de medio' })
    await userEvent.click(within(tipos).getByRole('button', { name: 'Videos' }))

    expect(router.state.location.search).toBe('?seccion=salidas&tipo=video')
    await screen.findByText('Mostrando 1 de 30 evidencias')
    expect(peticiones.at(-1).params).toEqual({
      seccion: 'salidas',
      tipo: 'video',
      limite: '24',
      desplazamiento: '0',
    })
  })
})

describe('Contacto', () => {
  async function llenarFormulario() {
    await userEvent.type(screen.getByLabelText(/^Nombre/), 'Ana Pérez')
    await userEvent.type(screen.getByLabelText(/^Correo electrónico/), 'ana@example.com')
    await userEvent.type(screen.getByLabelText(/^Mensaje/), 'Queremos visitar el museo.')
    await userEvent.click(screen.getByRole('checkbox'))
  }

  it('muestra los errores junto a cada campo y enfoca el primero', async () => {
    const { peticiones } = instalarApiFalsa()
    renderRoute(RUTAS.contacto)

    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    const nombre = screen.getByLabelText(/^Nombre/)
    expect(nombre).toHaveFocus()
    expect(nombre).toHaveAttribute('aria-invalid', 'true')
    expect(nombre).toHaveAccessibleDescription(/mínimo 2 caracteres/)
    expect(
      screen.getByText('Necesitamos tu autorización para guardar tus datos.'),
    ).toBeInTheDocument()
    expect(peticiones).toHaveLength(0)
  })

  it('envía el contacto a la API y confirma la recepción', async () => {
    const { peticiones } = instalarApiFalsa({
      'POST visitantes': respuestaJson({ id: 1, creado_en: '2026-10-03T00:00:00Z' }, 201),
    })
    renderRoute(RUTAS.contacto)

    await llenarFormulario()
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Recibimos tu mensaje')
    expect(peticiones[0]).toMatchObject({
      metodo: 'POST',
      ruta: 'visitantes',
      cuerpo: {
        origen: 'contacto',
        nombre: 'Ana Pérez',
        correo: 'ana@example.com',
        mensaje: 'Queremos visitar el museo.',
        consentimiento_datos: true,
      },
    })
    expect(screen.getByLabelText(/^Nombre/)).toHaveValue('')
  })

  it('muestra el mensaje de la API si rechaza el envío', async () => {
    instalarApiFalsa({
      'POST visitantes': respuestaJson(
        { detail: 'El formulario de contacto requiere un mensaje.' },
        422,
      ),
    })
    renderRoute(RUTAS.contacto)

    await llenarFormulario()
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('requiere un mensaje')
  })
})
