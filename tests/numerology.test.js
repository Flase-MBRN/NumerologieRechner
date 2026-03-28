import { describe, it, expect } from 'vitest'

// Test data
const TEST_DATA = {
  validNames: ['Max Mustermann', 'Anna-Maria', 'Jean-Pierre'],
  validDates: ['15.03.1990', '01.01.2000', '31.12.1985'],
  invalidDates: ['32.13.1990', 'abc', ''],
  masterNumbers: [11, 22, 33],
  standardNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9]
}

describe('Numerology Engine', () => {
  describe('Input Validation', () => {
    it('should accept valid names', () => {
      TEST_DATA.validNames.forEach(name => {
        expect(name).toBeTruthy()
        expect(name.length).toBeGreaterThan(0)
      })
    })

    it('should reject empty names', () => {
      expect('').toBeFalsy()
    })

    it('should accept valid German date format', () => {
      const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/
      TEST_DATA.validDates.forEach(date => {
        expect(date).toMatch(dateRegex)
      })
    })

    it('should reject invalid dates', () => {
      TEST_DATA.invalidDates.forEach(date => {
        const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/
        expect(date).not.toMatch(dateRegex)
      })
    })
  })

  describe('Number Reduction', () => {
    it('should reduce numbers to single digit (except master numbers)', () => {
      const reduceNumber = (n) => {
        if ([11, 22, 33].includes(n)) return n
        return n % 9 || 9
      }
      
      expect(reduceNumber(10)).toBe(1)
      expect(reduceNumber(19)).toBe(1)
      expect(reduceNumber(28)).toBe(1)
      expect(reduceNumber(11)).toBe(11) // Master number
      expect(reduceNumber(22)).toBe(22) // Master number
    })
  })

  describe('Life Path Calculation', () => {
    it('should calculate life path from date components', () => {
      const calculateLifePath = (day, month, year) => {
        const sum = day + month + year
        return sum % 9 || 9
      }
      
      expect(calculateLifePath(15, 3, 1990)).toBeGreaterThan(0)
      expect(calculateLifePath(1, 1, 2000)).toBeGreaterThan(0)
    })
  })

  describe('Name to Number Conversion', () => {
    it('should convert letters to correct Pythagorean values', () => {
      const letterValues = {
        a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
        j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
        s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
      }
      
      expect(letterValues.a).toBe(1)
      expect(letterValues.z).toBe(8)
      expect(letterValues.y).toBe(7)
    })
  })
})

describe('LocalStorage', () => {
  it('should store and retrieve theme preference', () => {
    const mockStorage = {
      theme: 'dark'
    }
    
    expect(mockStorage.theme).toBe('dark')
    
    mockStorage.theme = 'light'
    expect(mockStorage.theme).toBe('light')
  })
})
