import { describe, it, expect } from 'vitest'
import { paginarBloques } from './paginar'

describe('paginarBloques', () => {
  it('existe y devuelve un array', () => {
    expect(Array.isArray(paginarBloques([], 100, 100))).toBe(true)
  })
})
