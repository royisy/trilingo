import { vi } from 'vitest'
import { db } from '../db'
import { Deck } from './Deck'
import { Word } from './Word'

describe('Deck', () => {
  beforeAll(async () => {
    const deck1 = new Deck(1, 'deck 1')
    await db.decks.add(deck1)
    const word1 = new Word(1, 1, 'definition 1', 'answer 1')
    await db.words.add(word1)
  })

  it('should save Deck with Words', async () => {
    const word2 = new Word(2, 1, 'definition 2', 'answer 2')
    const word3 = new Word(2, 2, 'definition 3', 'answer 3')
    const deck2 = new Deck(2, 'deck 2')
    await deck2.save([word2, word3])
    const decks = await db.decks.toArray()
    expect(decks).toHaveLength(2)
    const words = await db.words.toArray()
    expect(words).toHaveLength(3)
  })

  it('should rollback when saving Deck with Words', async () => {
    const word4 = new Word(2, 3, 'definition 4', 'answer 4')
    const deck3 = new Deck(2, 'deck 2')
    await expect(deck3.save([word4])).rejects.toThrowError('ConstraintError')
    const decks = await db.decks.toArray()
    expect(decks).toHaveLength(2)
    const words = await db.words.toArray()
    expect(words).toHaveLength(3)
  })

  it('should delete Deck with Words', async () => {
    const deck2 = await db.decks.get(2)
    await deck2?.delete()
    const decks = await db.decks.toArray()
    expect(decks).toHaveLength(1)
    const words = await db.words.toArray()
    expect(words).toHaveLength(1)
  })

  it('should rollback when deleting Deck with Words', async () => {
    vi.spyOn(db.words, 'where').mockImplementation(() => {
      throw new Error('mock error')
    })
    const deck1 = await db.decks.get(1)
    await expect(deck1?.delete()).rejects.toThrowError('mock error')
    const decks = await db.decks.toArray()
    expect(decks).toHaveLength(1)
    const words = await db.words.toArray()
    expect(words).toHaveLength(1)
  })

  afterAll(async () => {
    await db.decks.clear()
    await db.words.clear()
  })
})
