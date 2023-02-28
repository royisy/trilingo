import { normalizeString } from './stringUtils'

describe('normalizeString', () => {
  it('should remove spaces of beginning and end', () => {
    expect(normalizeString(' abc ')).toEqual('abc')
  })
  it('should normalize german characters', () => {
    expect(normalizeString('ä ö ü ß Ä Ö Ü')).toEqual('a o u ss a o u')
  })
  it('should lower case', () => {
    expect(normalizeString('ABC')).toEqual('abc')
  })
})
