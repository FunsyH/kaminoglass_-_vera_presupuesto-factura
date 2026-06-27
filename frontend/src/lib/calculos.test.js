import { describe, it, expect } from 'vitest'
import { calcularTotales } from './calculos'

// Tests centrados en los modos de total, en especial el nuevo 'manualBase'
// (el usuario teclea la BASE sin IVA y se le suma el IVA 21% encima).
describe('calcularTotales', () => {
  it("modo 'manualBase': suma el IVA 21% sobre la base tecleada", () => {
    const quote = { totalMode: 'manualBase', manualBase: 1000, ivaRate: 0.21 }
    expect(calcularTotales(quote)).toEqual({ base: 1000, iva: 210, total: 1210 })
  })

  it("modo 'manualBase': base + iva === total siempre (sin céntimo fantasma)", () => {
    const quote = { totalMode: 'manualBase', manualBase: 3388.43, ivaRate: 0.21 }
    const { base, iva, total } = calcularTotales(quote)
    expect(redondea(base + iva)).toBe(total)
  })

  it("modo 'manualBase': base inválida -> todo a cero", () => {
    const quote = { totalMode: 'manualBase', manualBase: null, ivaRate: 0.21 }
    expect(calcularTotales(quote)).toEqual({ base: 0, iva: 0, total: 0 })
  })

  it("modo 'manual': desglosa el total con IVA hacia atrás", () => {
    const quote = { totalMode: 'manual', manualTotal: 1210, ivaRate: 0.21 }
    expect(calcularTotales(quote)).toEqual({ base: 1000, iva: 210, total: 1210 })
  })

  it("modo 'auto': suma líneas y añade IVA encima", () => {
    const quote = {
      totalMode: 'auto',
      ivaRate: 0.21,
      sections: [{ items: [{ qty: 1, unitPrice: 100 }, { qty: 2, unitPrice: 50 }] }],
    }
    expect(calcularTotales(quote)).toEqual({ base: 200, iva: 42, total: 242 })
  })
})

function redondea(n) {
  return Math.round(n * 100) / 100
}
