import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { evidencia } from '@/test/fixtures.js'
import { GaleriaDeEvidencias } from './GaleriaDeEvidencias.jsx'

const foto = evidencia({ titulo: 'Altar de la sanación', url: 'media/museo/2025-altar-sanacion' })
const video = evidencia({
  tipo: 'video',
  titulo: 'Video resumen 2025',
  url: 'https://www.youtube.com/watch?v=-O6inKLKRRI',
  creditos: null,
})
const enlace = evidencia({
  tipo: 'enlace',
  titulo: 'Publicación del CNMH',
  url: 'https://x.com/CentroMemoriaH/status/1',
})

describe('GaleriaDeEvidencias', () => {
  it('muestra una miniatura por evidencia sin cargar reproductores de terceros', () => {
    render(<GaleriaDeEvidencias evidencias={[foto, video, enlace]} />)

    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(screen.getByRole('button', { name: /Video: Video resumen 2025/ })).toBeInTheDocument()
    expect(document.querySelector('iframe')).toBeNull()
  })

  it('abre la foto en grande con su texto alternativo y sus créditos', async () => {
    render(<GaleriaDeEvidencias evidencias={[foto, video]} />)

    await userEvent.click(screen.getByRole('button', { name: /Altar de la sanación/ }))

    const visor = screen.getByRole('dialog', { name: 'Altar de la sanación' })
    const imagen = within(visor).getByRole('img', { name: 'Altar de la sanación' })
    expect(imagen).toHaveAttribute('src', '/media/museo/2025-altar-sanacion-lg.webp')
    expect(within(visor).getByText('Créditos: Archivo del proyecto')).toBeInTheDocument()
    expect(within(visor).getByText('1 de 2')).toBeInTheDocument()
  })

  it('recorre las evidencias y carga el video solo al llegar a él', async () => {
    render(<GaleriaDeEvidencias evidencias={[foto, video, enlace]} />)

    await userEvent.click(screen.getByRole('button', { name: /Altar de la sanación/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }))

    const iframe = screen.getByTitle('Video resumen 2025')
    expect(iframe).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/-O6inKLKRRI')

    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
    expect(screen.getByRole('link', { name: /Publicación del CNMH/ })).toHaveAttribute(
      'href',
      'https://x.com/CentroMemoriaH/status/1',
    )
  })

  it('no dibuja nada si no hay evidencias', () => {
    const { container } = render(<GaleriaDeEvidencias evidencias={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
