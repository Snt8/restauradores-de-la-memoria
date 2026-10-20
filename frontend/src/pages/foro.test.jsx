import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { RUTAS } from '@/app/navegacion.js'
import { instalarApiFalsa, pagina, respuestaJson } from '@/test/apiFalsa.js'
import { comentarioForo, publicacionForo } from '@/test/fixtures.js'
import { renderRoute } from '@/test/renderRoute.jsx'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

describe('Foro: muro de publicaciones', () => {
  it('muestra cada publicación con su categoría, autor, votos y comentarios', async () => {
    const publicacion = publicacionForo({
      titulo: 'Recuerdos del 9 de abril en el colegio',
      categoria: 'historias',
      autor: 'Marta',
      puntaje: 12,
      comentarios: 3,
    })
    const { peticiones } = instalarApiFalsa({ 'foro/publicaciones': pagina([publicacion]) })
    renderRoute(RUTAS.foro)

    const enlace = await screen.findByRole('link', { name: publicacion.titulo })
    expect(enlace).toHaveAttribute('href', RUTAS.publicacionForo(publicacion.id))
    const tarjeta = enlace.closest('article')
    expect(within(tarjeta).getByText('Historias y testimonios')).toBeInTheDocument()
    expect(within(tarjeta).getByText('Marta')).toBeInTheDocument()
    expect(within(tarjeta).getAllByText('12')).not.toHaveLength(0)
    expect(within(tarjeta).getByRole('link', { name: '3 comentarios' })).toHaveAttribute(
      'href',
      `${RUTAS.publicacionForo(publicacion.id)}#comentarios`,
    )
    expect(peticiones[0].params.votante).toMatch(UUID)
    expect(screen.getByRole('heading', { level: 1, name: 'Foro de la Memoria' })).toBeVisible()
  })

  it('filtra por categoría con enlaces que conservan el orden elegido', async () => {
    const { peticiones } = instalarApiFalsa({ 'foro/publicaciones': pagina([]) })
    const { router } = renderRoute(`${RUTAS.foro}?orden=recientes`)
    const categorias = screen.getByRole('navigation', { name: 'Categorías' })

    await userEvent.click(within(categorias).getByRole('link', { name: 'Salidas pedagógicas' }))

    expect(router.state.location.search).toBe('?orden=recientes&categoria=salidas')
    await waitFor(() =>
      expect(peticiones.at(-1).params).toMatchObject({ categoria: 'salidas', orden: 'recientes' }),
    )
    expect(within(categorias).getByRole('link', { name: 'Salidas pedagógicas' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('cambia el orden del muro y lo guarda en la URL', async () => {
    const { peticiones } = instalarApiFalsa({ 'foro/publicaciones': pagina([]) })
    const { router } = renderRoute(RUTAS.foro)
    const orden = screen.getByRole('group', { name: 'Ordenar publicaciones' })

    expect(within(orden).getByRole('button', { name: 'Populares' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await userEvent.click(within(orden).getByRole('button', { name: 'Más votadas' }))

    expect(router.state.location.search).toBe('?orden=mejores')
    await waitFor(() => expect(peticiones.at(-1).params.orden).toBe('mejores'))
  })

  it('invita a abrir la primera conversación de una categoría vacía', async () => {
    instalarApiFalsa({ 'foro/publicaciones': pagina([]) })
    renderRoute(`${RUTAS.foro}?categoria=preguntas`)

    const vacio = (await screen.findByText('Todavía no hay conversaciones aquí')).parentElement
    expect(within(vacio).getByRole('link', { name: 'Crear publicación' })).toHaveAttribute(
      'href',
      `${RUTAS.nuevaPublicacionForo}?categoria=preguntas`,
    )
  })

  it('carga más publicaciones bajo demanda', async () => {
    instalarApiFalsa({
      'foro/publicaciones': ({ params }) =>
        pagina([publicacionForo({ titulo: `Publicación desde ${params.desplazamiento}` })], {
          total: 25,
          limite: 20,
          desplazamiento: Number(params.desplazamiento),
        }),
    })
    renderRoute(RUTAS.foro)

    await userEvent.click(await screen.findByRole('button', { name: 'Ver más publicaciones' }))

    expect(await screen.findByText('Publicación desde 20')).toBeInTheDocument()
  })
})

describe('Foro: votos', () => {
  function instalarConVoto(respuestaDelVoto) {
    const publicacion = publicacionForo({ puntaje: 5 })
    const api = instalarApiFalsa({
      'foro/publicaciones': pagina([publicacion]),
      [`PUT foro/publicaciones/${publicacion.id}/voto`]: respuestaDelVoto,
    })
    renderRoute(RUTAS.foro)
    return api
  }

  it('vota al instante, confirma con la API y retira el voto con un segundo clic', async () => {
    const { peticiones } = instalarConVoto(({ cuerpo }) => ({
      puntaje: 5 + cuerpo.valor,
      mi_voto: cuerpo.valor,
    }))
    const [aFavor] = await screen.findAllByRole('button', { name: 'Votar a favor' })

    await userEvent.click(aFavor)

    expect(aFavor).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByText('6')).toHaveLength(2)
    await waitFor(() => expect(peticiones.at(-1).metodo).toBe('PUT'))
    expect(peticiones.at(-1).cuerpo).toEqual({ votante: expect.stringMatching(UUID), valor: 1 })

    await userEvent.click(aFavor)

    expect(aFavor).toHaveAttribute('aria-pressed', 'false')
    await waitFor(() => expect(peticiones.at(-1).cuerpo.valor).toBe(0))
    expect(screen.getAllByText('5')).toHaveLength(2)
  })

  it('vuelve al estado anterior si la API rechaza el voto', async () => {
    instalarConVoto(() => respuestaJson({ detail: 'error' }, 500))
    const [enContra] = await screen.findAllByRole('button', { name: 'Votar en contra' })

    await userEvent.click(enContra)

    await waitFor(() => expect(enContra).toHaveAttribute('aria-pressed', 'false'))
    expect(screen.getAllByText('5')).toHaveLength(2)
    expect(screen.getAllByRole('alert')[0]).toHaveTextContent('No pudimos registrar tu voto')
  })
})

describe('Foro: publicación y comentarios', () => {
  const publicacion = publicacionForo({
    id: 500,
    titulo: 'Sobre la salida al CMPR',
    comentarios: 3,
  })
  const luis = comentarioForo({
    publicacion_id: 500,
    autor: 'Luis',
    contenido: 'Fue muy emotivo.',
    puntaje: 1,
  })
  const sofia = comentarioForo({
    publicacion_id: 500,
    padre_id: luis.id,
    autor: 'Sofía',
    contenido: 'Totalmente de acuerdo.',
  })
  const camilo = comentarioForo({
    publicacion_id: 500,
    autor: 'Camilo',
    contenido: 'Yo no pude ir.',
    puntaje: 4,
  })

  function instalarPublicacion() {
    return instalarApiFalsa({
      'foro/publicaciones/500': publicacion,
      'foro/publicaciones/500/comentarios': [luis, sofia, camilo],
      'POST foro/publicaciones/500/comentarios': ({ cuerpo }) =>
        respuestaJson(comentarioForo({ ...cuerpo, publicacion_id: 500 }), 201),
    })
  }

  it('muestra la publicación completa y los comentarios en hilo, mejor votados primero', async () => {
    instalarPublicacion()
    renderRoute(RUTAS.publicacionForo(500))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Sobre la salida al CMPR' }),
    ).toBeInTheDocument()
    await waitFor(() => expect(document.title).toContain('Sobre la salida al CMPR'))

    const raices = await screen.findAllByText(/^(Fue muy emotivo|Yo no pude ir)\.$/)
    expect(raices.map((parrafo) => parrafo.textContent)).toEqual([
      'Yo no pude ir.',
      'Fue muy emotivo.',
    ])
    const hiloDeLuis = screen.getByRole('article', { name: 'Luis' })
    expect(within(hiloDeLuis).getByRole('article', { name: 'Sofía' })).toHaveTextContent(
      'Totalmente de acuerdo.',
    )
  })

  it('contrae un hilo y avisa cuántas respuestas oculta', async () => {
    instalarPublicacion()
    renderRoute(RUTAS.publicacionForo(500))

    const contraer = await screen.findByRole('button', { name: 'Ocultar el comentario de Luis' })
    await userEvent.click(contraer)

    expect(screen.queryByText('Totalmente de acuerdo.')).not.toBeInTheDocument()
    expect(screen.getByText('· 1 respuesta oculta')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mostrar el comentario de Luis' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('responde a un comentario enviando su id como padre', async () => {
    const { peticiones } = instalarPublicacion()
    renderRoute(RUTAS.publicacionForo(500))

    const hiloDeLuis = await screen.findByRole('article', { name: 'Luis' })
    await userEvent.click(within(hiloDeLuis).getAllByRole('button', { name: 'Responder' })[0])
    const formulario = screen.getByRole('form', { name: 'Responder comentario' })
    await userEvent.type(within(formulario).getByLabelText('Tu respuesta'), '  Yo también  ')
    await userEvent.type(within(formulario).getByLabelText('Firma'), 'Ana')
    await userEvent.click(within(formulario).getByRole('button', { name: 'Responder' }))

    await waitFor(() => expect(peticiones.some((p) => p.metodo === 'POST')).toBe(true))
    expect(peticiones.find((p) => p.metodo === 'POST').cuerpo).toEqual({
      contenido: 'Yo también',
      autor: 'Ana',
      padre_id: luis.id,
    })
    await waitFor(() =>
      expect(screen.queryByRole('form', { name: 'Responder comentario' })).not.toBeInTheDocument(),
    )
  })

  it('no envía comentarios vacíos y explica qué falta', async () => {
    const { peticiones } = instalarPublicacion()
    renderRoute(RUTAS.publicacionForo(500))

    const formulario = await screen.findByRole('form', { name: 'Escribir un comentario' })
    await userEvent.clear(within(formulario).getByLabelText('Firma'))
    await userEvent.click(within(formulario).getByRole('button', { name: 'Comentar' }))

    expect(within(formulario).getByLabelText('Tu comentario')).toHaveFocus()
    expect(within(formulario).getByText('Escribe tu comentario antes de enviarlo.')).toBeVisible()
    expect(peticiones.every((p) => p.metodo === 'GET')).toBe(true)
  })

  it('muestra la página 404 si la publicación no existe', async () => {
    instalarApiFalsa()
    renderRoute(RUTAS.publicacionForo(999))

    expect(await screen.findByRole('heading', { name: 'Página no encontrada' })).toBeVisible()
  })
})

describe('Foro: crear una publicación', () => {
  it('valida, publica con los textos limpios y abre la publicación creada', async () => {
    let creada = null
    const { peticiones } = instalarApiFalsa({
      'POST foro/publicaciones': ({ cuerpo }) => {
        creada = publicacionForo({ id: 77, ...cuerpo })
        return respuestaJson(creada, 201)
      },
      'foro/publicaciones/77': () => creada,
      'foro/publicaciones/77/comentarios': [],
    })
    const { router } = renderRoute(`${RUTAS.nuevaPublicacionForo}?categoria=salidas`)

    expect(screen.getByRole('radio', { name: /Salidas pedagógicas/ })).toBeChecked()
    await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))
    expect(screen.getByLabelText(/^Título/)).toHaveFocus()
    expect(screen.getByText('Escribe un título de al menos 5 caracteres.')).toBeVisible()

    await userEvent.type(screen.getByLabelText(/^Título/), '  Lo que aprendí en el CMPR ')
    await userEvent.type(screen.getByLabelText(/^Contenido/), 'Escuchar a las víctimas.')
    await userEvent.type(screen.getByLabelText(/^Firma/), 'Ana')
    await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    await waitFor(() => expect(router.state.location.pathname).toBe(RUTAS.publicacionForo(77)))
    expect(peticiones.find((p) => p.metodo === 'POST').cuerpo).toEqual({
      categoria: 'salidas',
      titulo: 'Lo que aprendí en el CMPR',
      contenido: 'Escuchar a las víctimas.',
      autor: 'Ana',
    })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Lo que aprendí en el CMPR' }),
    ).toBeInTheDocument()
  })
})

describe('Inicio: desde el foro', () => {
  it('destaca las conversaciones más activas', async () => {
    const { peticiones } = instalarApiFalsa({
      'foro/publicaciones': pagina([
        publicacionForo({ id: 9, titulo: 'Ideas para el museo 2027' }),
      ]),
    })
    renderRoute(RUTAS.inicio)

    expect(await screen.findByRole('link', { name: 'Ideas para el museo 2027' })).toHaveAttribute(
      'href',
      RUTAS.publicacionForo(9),
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Desde el foro' })).toBeInTheDocument()
    expect(peticiones.find((p) => p.ruta === 'foro/publicaciones').params).toMatchObject({
      orden: 'populares',
      limite: '3',
    })
  })
})
