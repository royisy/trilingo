import { Word } from '../models/Word'
import { useStats } from './useStats'

describe('useStats', () => {
  it('should return memorized words, remaining words, and progress', () => {
    const word1 = new Word(1, 1, 'definition 1', 'answer 1')
    word1.correctCnt = 1
    const word2 = new Word(1, 2, 'definition 2', 'answer 2')
    word2.correctCnt = 0
    const word3 = new Word(1, 3, 'definition 3', 'answer 3')
    word3.correctCnt = 0
    const word4 = new Word(1, 4, 'definition 4', 'answer 4')
    word4.correctCnt = 1
    const word5 = new Word(1, 5, 'definition 5', 'answer 5')
    word5.correctCnt = 1
    const words = [word1, word2, word3, word4, word5]
    const { memorizedWords, remainingWords, progress } = useStats(words)
    expect(memorizedWords).toBe(3)
    expect(remainingWords).toBe(2)
    expect(progress).toBe('60.0')
  })
})
