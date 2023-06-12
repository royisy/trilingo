import { vi } from 'vitest'
import { db } from '../db'
import { Deck } from './Deck'
import { Word } from './Word'

describe('Deck', () => {
  beforeAll(async () => {
    const deck1 = new Deck(1, 'language 1', 'deck 1')
    await db.decks.add(deck1)
    const word1 = new Word(1, 1, 'pos 1', 'definition 1', 'answer 1')
    await db.words.add(word1)
  })

  describe('words', () => {
    it('should get Words of Deck', async () => {
      const deck2 = new Deck(2, 'language 2', 'deck 2')
      await db.decks.add(deck2)
      const word2 = new Word(2, 1, 'pos 2', 'definition 2', 'answer 2')
      await db.words.add(word2)
      const word3 = new Word(2, 2, 'pos 3', 'definition 3', 'answer 3')
      await db.words.add(word3)
      const deck = await db.decks.get(2)
      const words = await deck?.words
      expect(words).toHaveLength(2)
    })
  })

  describe('save', () => {
    it('should save Deck with Words', async () => {
      const word4 = new Word(3, 1, 'pos 4', 'definition 4', 'answer 4')
      const word5 = new Word(3, 2, 'pos 5', 'definition 5', 'answer 5')
      const deck3 = new Deck(3, 'language 3', 'deck 3')
      await deck3.save([word4, word5])
      const decks = await db.decks.toArray()
      expect(decks).toHaveLength(3)
      const words = await db.words.toArray()
      expect(words).toHaveLength(5)
    })

    it('should rollback when saving Deck with Words', async () => {
      const word6 = new Word(3, 3, 'pos 6', 'definition 6', 'answer 6')
      const deck3 = new Deck(3, 'language 3', 'deck 3')
      await expect(deck3.save([word6])).rejects.toThrowError('ConstraintError')
      const decks = await db.decks.toArray()
      expect(decks).toHaveLength(3)
      const words = await db.words.toArray()
      expect(words).toHaveLength(5)
    })
  })

  describe('delete', () => {
    it('should delete Deck with Words', async () => {
      const deck2 = await db.decks.get(2)
      await deck2?.delete()
      const deck3 = await db.decks.get(3)
      await deck3?.delete()
      const decks = await db.decks.toArray()
      expect(decks).toHaveLength(1)
      const words = await db.words.toArray()
      expect(words).toHaveLength(1)
    })

    it('should rollback when deleting Deck with Words', async () => {
      const wordsMock = vi.spyOn(db.words, 'where').mockImplementation(() => {
        throw new Error('mock error')
      })
      const deck1 = await db.decks.get(1)
      await expect(deck1?.delete()).rejects.toThrowError('mock error')
      const decks = await db.decks.toArray()
      expect(decks).toHaveLength(1)
      const words = await db.words.toArray()
      expect(words).toHaveLength(1)
      wordsMock.mockRestore()
    })
  })

  describe('getUnansweredWords', () => {
    it('should get Words where correctCnt = 0', async () => {
      const deck2 = new Deck(2, 'language 2', 'deck 2')
      await db.decks.add(deck2)
      const word2 = new Word(2, 1, 'pos 2', 'definition 2', 'answer 2')
      word2.correctCnt = 0
      await db.words.add(word2)
      const word3 = new Word(2, 2, 'pos 3', 'definition 3', 'answer 3')
      word3.correctCnt = 0
      await db.words.add(word3)
      const word4 = new Word(2, 3, 'pos 4', 'definition 4', 'answer 4')
      word4.correctCnt = 1
      await db.words.add(word4)
      const words = await deck2.getUnansweredWords()
      expect(words).toHaveLength(2)
      expect(words[0].no).toBe(1)
      expect(words[1].no).toBe(2)
      await deck2?.delete()
    })
  })

  describe('getAnsweredWords', () => {
    it('should get Words where correctCnt > 0', async () => {
      const deck2 = new Deck(2, 'language 2', 'deck 2')
      await db.decks.add(deck2)
      const word2 = new Word(2, 1, 'pos 2', 'definition 2', 'answer 2')
      word2.correctCnt = 0
      await db.words.add(word2)
      const word3 = new Word(2, 2, 'pos 3', 'definition 3', 'answer 3')
      word3.correctCnt = 1
      await db.words.add(word3)
      const word4 = new Word(2, 3, 'pos 4', 'definition 4', 'answer 4')
      word4.correctCnt = 2
      await db.words.add(word4)
      const words = await deck2.getAnsweredWords()
      expect(words).toHaveLength(2)
      expect(words[0].no).toBe(2)
      expect(words[1].no).toBe(3)
    })
  })
})
