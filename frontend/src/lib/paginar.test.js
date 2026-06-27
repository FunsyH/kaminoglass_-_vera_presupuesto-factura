import { describe, it, expect } from 'vitest'
import { paginarBloques } from './paginar'

const item = (alto, ref) => ({ tipo: 'item', alto, ref })
const titulo = (alto, ref) => ({ tipo: 'titulo', alto, ref })

describe('paginarBloques', () => {
  it('mete todo en una hoja cuando cabe', () => {
    const bloques = [item(10, 'a'), item(10, 'b'), item(10, 'c')]
    const hojas = paginarBloques(bloques, 100, 100)
    expect(hojas).toHaveLength(1)
    expect(hojas[0].bloques.map(b => b.ref)).toEqual(['a', 'b', 'c'])
  })

  it('abre una segunda hoja cuando se desborda', () => {
    const bloques = [item(40, 'a'), item(40, 'b'), item(40, 'c')]
    // alto util 100: caben a(40)+b(40)=80; c(40) desborda -> hoja 2
    const hojas = paginarBloques(bloques, 100, 100)
    expect(hojas).toHaveLength(2)
    expect(hojas[0].bloques.map(b => b.ref)).toEqual(['a', 'b'])
    expect(hojas[1].bloques.map(b => b.ref)).toEqual(['c'])
  })

  it('usa altoUtilSiguientes distinto en hojas 2+', () => {
    const bloques = [item(60, 'a'), item(60, 'b'), item(30, 'c')]
    // hoja 1 util 100: a(60) cabe; b(60) desborda -> hoja 2
    // hoja 2 util 50: b(60) excede pero va solo; c(30) -> hoja 3
    const hojas = paginarBloques(bloques, 100, 50)
    expect(hojas).toHaveLength(3)
    expect(hojas[0].bloques.map(b => b.ref)).toEqual(['a'])
    expect(hojas[1].bloques.map(b => b.ref)).toEqual(['b'])
    expect(hojas[2].bloques.map(b => b.ref)).toEqual(['c'])
  })

  it('no deja un titulo huerfano al pie: lo baja con su primer item', () => {
    const bloques = [item(70, 'a'), titulo(10, 'T'), item(40, 'b')]
    // hoja 1 util 100: a(70) cabe (70). titulo(10) cabria (80) pero su item
    // siguiente b(40) no cabe (120>100): el titulo NO se queda solo -> baja con b.
    const hojas = paginarBloques(bloques, 100, 100)
    expect(hojas).toHaveLength(2)
    expect(hojas[0].bloques.map(b => b.ref)).toEqual(['a'])
    expect(hojas[1].bloques.map(b => b.ref)).toEqual(['T', 'b'])
  })

  it('coloca un bloque gigante solo en su hoja sin bucle', () => {
    const bloques = [item(200, 'grande'), item(10, 'a')]
    const hojas = paginarBloques(bloques, 100, 100)
    expect(hojas).toHaveLength(2)
    expect(hojas[0].bloques.map(b => b.ref)).toEqual(['grande'])
    expect(hojas[1].bloques.map(b => b.ref)).toEqual(['a'])
  })

  it('devuelve una hoja vacia cuando no hay bloques', () => {
    const hojas = paginarBloques([], 100, 100)
    expect(hojas).toHaveLength(1)
    expect(hojas[0].bloques).toEqual([])
  })
})
