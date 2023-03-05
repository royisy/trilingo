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

  it('should delete Deck with Words', async () => {
    const deck = await db.decks.get(2)
    await deck?.delete()
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
