import { db } from '../db'
import { Word } from '../models/Word'
import {
  getWordsByCorrectCnt,
  getWordsByDeckId,
  getWordsBySkippedCnt,
} from './word'

describe('word', () => {
  beforeAll(async () => {
    const word1 = new Word(1, 1, 'definition 1', 'answer 1')
    word1.correctCnt = 3
    word1.skippedCnt = 1
    await db.words.add(word1)
    const word2 = new Word(1, 2, 'definition 2', 'answer 2')
    word2.correctCnt = 2
    word2.skippedCnt = 2
    await db.words.add(word2)
    const word3 = new Word(1, 3, 'definition 3', 'answer 3')
    word3.correctCnt = 1
    word3.skippedCnt = 3
    await db.words.add(word3)
    const word4 = new Word(1, 4, 'definition 4', 'answer 4')
    word4.correctCnt = 0
    word4.skippedCnt = 3
    await db.words.add(word4)
    const word5 = new Word(1, 5, 'definition 5', 'answer 5')
    word5.correctCnt = 0
    word5.skippedCnt = 2
    await db.words.add(word5)
    const word6 = new Word(1, 6, 'definition 6', 'answer 6')
    word6.correctCnt = 0
    word6.skippedCnt = 1
    await db.words.add(word6)
    const word7 = new Word(2, 1, 'definition 7', 'answer 7')
    word7.correctCnt = 1
    word7.skippedCnt = 0
    await db.words.add(word7)
    const word8 = new Word(2, 2, 'definition 8', 'answer 8')
    word8.correctCnt = 0
    word8.skippedCnt = 0
    await db.words.add(word8)
  })

  describe('getWordsByDeckId', () => {
    it('should get words by deck id', async () => {
      const words = await getWordsByDeckId(1)
      expect(words).toHaveLength(6)
    })
  })

  describe('getWordsByCorrectCnt', () => {
    it('should get words by correct count', async () => {
      const words = await getWordsByCorrectCnt(1, 2)
      expect(words).toHaveLength(2)
      expect(words[0].no).toBe(3)
      expect(words[1].no).toBe(2)
    })
  })

  describe('getWordsBySkippedCnt', () => {
    it('should get words by skipped count', async () => {
      const words = await getWordsBySkippedCnt(1, 2)
      expect(words).toHaveLength(2)
      expect(words[0].no).toBe(6)
      expect(words[1].no).toBe(5)
    })
  })

  afterAll(async () => {
    await db.words.clear()
  })
})
