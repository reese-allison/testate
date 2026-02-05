import { describe, it, expect } from 'vitest'
import { toRoman, toWords } from './formatters'

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

describe('toWords', () => {
  describe('single digits (0-9)', () => {
    it('converts 0 to zero', () => {
      expect(toWords(0)).toBe('zero')
    })

    it('converts 1 to one', () => {
      expect(toWords(1)).toBe('one')
    })

    it('converts 9 to nine', () => {
      expect(toWords(9)).toBe('nine')
    })
  })

  describe('teens (10-19)', () => {
    it('converts 10 to ten', () => {
      expect(toWords(10)).toBe('ten')
    })

    it('converts 11 to eleven', () => {
      expect(toWords(11)).toBe('eleven')
    })

    it('converts 18 to eighteen', () => {
      expect(toWords(18)).toBe('eighteen')
    })

    it('converts 19 to nineteen', () => {
      expect(toWords(19)).toBe('nineteen')
    })
  })

  describe('tens (20-99)', () => {
    it('converts 20 to twenty', () => {
      expect(toWords(20)).toBe('twenty')
    })

    it('converts 30 to thirty', () => {
      expect(toWords(30)).toBe('thirty')
    })

    it('converts 45 to forty-five', () => {
      expect(toWords(45)).toBe('forty-five')
    })

    it('converts 50 to fifty', () => {
      expect(toWords(50)).toBe('fifty')
    })

    it('converts 60 to sixty', () => {
      expect(toWords(60)).toBe('sixty')
    })

    it('converts 99 to ninety-nine', () => {
      expect(toWords(99)).toBe('ninety-nine')
    })
  })

  describe('one hundred', () => {
    it('converts 100 to one hundred', () => {
      expect(toWords(100)).toBe('one hundred')
    })
  })

  describe('edge cases', () => {
    it('returns string for numbers over 100', () => {
      expect(toWords(101)).toBe('101')
    })

    it('returns string for negative numbers', () => {
      expect(toWords(-5)).toBe('-5')
    })

    it('returns string for non-integers', () => {
      expect(toWords(3.5)).toBe('3.5')
    })

    it('returns string for non-numbers', () => {
      expect(toWords('thirty')).toBe('thirty')
    })
  })
})
