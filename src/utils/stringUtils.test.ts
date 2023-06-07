import { normalizeString } from './stringUtils'

describe('normalizeString', () => {
  it('should remove spaces of beginning and end', () => {
    expect(normalizeString(' abc ')).toEqual('abc')
  })

  it('should remove spaces and hyphens', () => {
    expect(normalizeString('a b-c')).toEqual('abc')
  })

  it('should normalize german characters', () => {
    expect(normalizeString('ä')).toEqual('a')
    expect(normalizeString('ö')).toEqual('o')
    expect(normalizeString('ü')).toEqual('u')
    expect(normalizeString('ß')).toEqual('ss')
    expect(normalizeString('Ä')).toEqual('a')
    expect(normalizeString('Ö')).toEqual('o')
    expect(normalizeString('Ü')).toEqual('u')
  })

  it('should lower case', () => {
    expect(normalizeString('ABC')).toEqual('abc')
  })
})
