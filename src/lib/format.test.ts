import { describe, expect, it } from 'vitest'
import { formatNumber, isISODate, parseDecimal, toInputValue, toISODate } from './format'

describe('parseDecimal', () => {
  it.each([
    ['12', 12],
    ['12,5', 12.5],
    ['12.5', 12.5],
    [' 0,75 ', 0.75],
    [',5', 0.5],
    ['3,', 3],
    ['0', 0],
  ])('« %s » → %d', (input, expected) => {
    expect(parseDecimal(input)).toBe(expected)
  })

  it.each(['', 'abc', '-3', '1,2,3', '1 000', '12kg'])('refuse « %s »', (input) => {
    expect(parseDecimal(input)).toBeNull()
  })
})

describe('formatage', () => {
  it('affiche les décimales avec une virgule', () => {
    expect(formatNumber(12.5)).toBe('12,5')
    expect(toInputValue(12.5)).toBe('12,5')
  })

  it('gère les dates locales', () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(isISODate('2026-01-05')).toBe(true)
    expect(isISODate('05/01/2026')).toBe(false)
  })
})
