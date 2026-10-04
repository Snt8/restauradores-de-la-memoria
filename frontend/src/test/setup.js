import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// jsdom no implementa <dialog>: basta con abrir/cerrar y emitir «close» como el navegador.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close() {
    if (!this.hasAttribute('open')) return
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}

// ScrollRestoration llama a window.scrollTo, que jsdom no implementa.
window.scrollTo = vi.fn()

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
