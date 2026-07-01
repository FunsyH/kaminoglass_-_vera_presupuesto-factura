import { describe, it, expect, beforeEach } from 'vitest'
import { sugerirSiguienteNumero, confirmarNumeroUsado } from './numeracionFactura'

// El entorno de test de Vitest aquí es 'node': no existe localStorage de
// forma nativa. Lo simulamos en memoria con un Map, igual de simple que el
// real, para no tener que añadir jsdom solo por este archivo.
beforeEach(() => {
  const store = new Map()
  global.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
  }
})

describe('sugerirSiguienteNumero', () => {
  it('primera factura del año (nada guardado) -> "1/2026"', () => {
    expect(sugerirSiguienteNumero('kng', 2026)).toBe('1/2026')
  })

  it('tras confirmar el número 1, la siguiente sugerencia es "2/2026"', () => {
    confirmarNumeroUsado('kng', 2026, 1)
    expect(sugerirSiguienteNumero('kng', 2026)).toBe('2/2026')
  })

  it('KNG y VERA llevan contadores independientes', () => {
    confirmarNumeroUsado('kng', 2026, 5)
    expect(sugerirSiguienteNumero('vera', 2026)).toBe('1/2026')
    expect(sugerirSiguienteNumero('kng', 2026)).toBe('6/2026')
  })

  it('desde 2027 usa prefijo + 3 cifras: "V-001/2027"', () => {
    expect(sugerirSiguienteNumero('vera', 2027)).toBe('V-001/2027')
  })

  it('desde 2027 con KNG usa prefijo "K": "K-001/2027"', () => {
    expect(sugerirSiguienteNumero('kng', 2027)).toBe('K-001/2027')
  })

  it('el correlativo de 2027 sigue subiendo con cifras seguidas', () => {
    confirmarNumeroUsado('vera', 2027, 1)
    confirmarNumeroUsado('vera', 2027, 2)
    expect(sugerirSiguienteNumero('vera', 2027)).toBe('V-003/2027')
  })

  it('un año nuevo arranca en 1 aunque el año anterior tuviera correlativo alto', () => {
    confirmarNumeroUsado('kng', 2026, 50)
    expect(sugerirSiguienteNumero('kng', 2027)).toBe('K-001/2027')
  })
})
