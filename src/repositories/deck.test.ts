import { db } from '../db'
import { Deck } from '../models/Deck'
import { getAllDecks, getDeckById } from './deck'

describe('deck', () => {
  beforeAll(async () => {
    const deck1 = new Deck(1, 'deck 1')
    await db.decks.add(deck1)
    const deck2 = new Deck(2, 'deck 2')
    await db.decks.add(deck2)
  })

  describe('getAllDecks', () => {
    it('should get all decks', async () => {
      const decks = await getAllDecks()
      expect(decks).toHaveLength(2)
    })
  })

  describe('getDeckById', () => {
    it('should get deck by id', async () => {
      const deck = await getDeckById(2)
      expect(deck).toBeInstanceOf(Deck)
      expect(deck?.id).toBe(2)
      expect(deck?.title).toBe('deck 2')
    })

    it('should return undefined when deck is not found', async () => {
      const deck = await getDeckById(3)
      expect(deck).toBeUndefined()
    })
  })
})
