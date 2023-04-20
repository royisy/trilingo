import { Word } from '../models/Word'
import { limitWords } from './wordUtils'

describe('limitWords', () => {
  const word1 = new Word(1, 1, 'definition 1', 'answer 1')
  word1.correctCnt = 1
  word1.skippedCnt = 3
  const word2 = new Word(1, 2, 'definition 2', 'answer 2')
  word2.correctCnt = 2
  word2.skippedCnt = 4
  const word3 = new Word(1, 3, 'definition 3', 'answer 3')
  word3.correctCnt = 4
  word3.skippedCnt = 2
  const word4 = new Word(1, 4, 'definition 4', 'answer 4')
  word4.correctCnt = 3
  word4.skippedCnt = 1

  it('should limit words sorted with correctCnt asc', () => {
    const words = [word1, word2, word3, word4]
    const limitedWords = limitWords(words, 3, 'correctCnt')
    expect(limitedWords).toHaveLength(3)
    expect(limitedWords[0].no).toBe(1)
    expect(limitedWords[1].no).toBe(2)
    expect(limitedWords[2].no).toBe(4)
  })

  it('should limit words sorted with skippedCnt asc', () => {
    const words = [word1, word2, word3, word4]
    const limitedWords = limitWords(words, 3, 'skippedCnt')
    expect(limitedWords).toHaveLength(3)
    expect(limitedWords[0].no).toBe(4)
    expect(limitedWords[1].no).toBe(3)
    expect(limitedWords[2].no).toBe(1)
  })
})
