import { normalizeString, splitAnswerByMatch } from './stringUtils'

describe('normalizeString', () => {
  it('should remove spaces of beginning and end', () => {
    expect(normalizeString(' abc ')).toBe('abc')
  })

  it('should remove spaces and hyphens', () => {
    expect(normalizeString('a b-c')).toBe('abc')
  })

  it('should normalize german characters', () => {
    expect(normalizeString('ä')).toBe('a')
    expect(normalizeString('ö')).toBe('o')
    expect(normalizeString('ü')).toBe('u')
    expect(normalizeString('ß')).toBe('ss')
    expect(normalizeString('Ä')).toBe('a')
    expect(normalizeString('Ö')).toBe('o')
    expect(normalizeString('Ü')).toBe('u')
  })

  it('should lower case', () => {
    expect(normalizeString('ABC')).toEqual('abc')
  })
})

describe('splitAnswerByMatch', () => {
  it('should split answer by user answer', () => {
    expect(splitAnswerByMatch('abc', '')).toEqual({
      matchedPart: '',
      remainingPart: 'abc',
    })
    expect(splitAnswerByMatch('abc', 'def')).toEqual({
      matchedPart: '',
      remainingPart: 'abc',
    })
    expect(splitAnswerByMatch('abc', 'a')).toEqual({
      matchedPart: 'a',
      remainingPart: 'bc',
    })
    expect(splitAnswerByMatch('abc', 'ab')).toEqual({
      matchedPart: 'ab',
      remainingPart: 'c',
    })
    expect(splitAnswerByMatch('abc', 'abc')).toEqual({
      matchedPart: 'abc',
      remainingPart: '',
    })
    expect(splitAnswerByMatch('abc', 'abcdef')).toEqual({
      matchedPart: 'abc',
      remainingPart: '',
    })
    expect(splitAnswerByMatch(' Abc ß def ', 'abc ss')).toEqual({
      matchedPart: ' Abc ß ',
      remainingPart: 'def ',
    })
    expect(splitAnswerByMatch('abc-d', 'abc')).toEqual({
      matchedPart: 'abc-',
      remainingPart: 'd',
    })
  })
})
