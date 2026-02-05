import { describe, it, expect } from 'vitest'
import { toRoman } from './formatters'

describe('toRoman', () => {
  it('converts 1 to I', () => {
    expect(toRoman(1)).toBe('I')
  })

  it('converts 2 to II', () => {
    expect(toRoman(2)).toBe('II')
  })

  it('converts 3 to III', () => {
    expect(toRoman(3)).toBe('III')
  })

  it('converts 4 to IV', () => {
    expect(toRoman(4)).toBe('IV')
  })

  it('converts 5 to V', () => {
    expect(toRoman(5)).toBe('V')
  })

  it('converts 6 to VI', () => {
    expect(toRoman(6)).toBe('VI')
  })

  it('converts 9 to IX', () => {
    expect(toRoman(9)).toBe('IX')
  })

  it('converts 10 to X', () => {
    expect(toRoman(10)).toBe('X')
  })

  it('converts 14 to XIV', () => {
    expect(toRoman(14)).toBe('XIV')
  })

  it('converts 19 to XIX', () => {
    expect(toRoman(19)).toBe('XIX')
  })

  it('converts 20 to XX', () => {
    expect(toRoman(20)).toBe('XX')
  })

  it('converts 24 to XXIV', () => {
    expect(toRoman(24)).toBe('XXIV')
  })

  it('converts 29 to XXIX', () => {
    expect(toRoman(29)).toBe('XXIX')
  })

  it('handles edge case of 0', () => {
    expect(toRoman(0)).toBe('')
  })
})
