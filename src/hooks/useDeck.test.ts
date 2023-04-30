import { renderHook, waitFor } from '@testing-library/react'
import { db } from '../db'
import { Deck } from '../models/Deck'
import { Word } from '../models/Word'
import { useDeck } from './useDeck'

describe('useDeck', () => {
  beforeAll(async () => {
    const deck1 = new Deck(1, 'deck 1')
    await db.decks.add(deck1)
    const word1 = new Word(1, 1, 'definition 1', 'answer 1')
    await db.words.add(word1)
    const deck2 = new Deck(2, 'deck 2')
    await db.decks.add(deck2)
    const word2 = new Word(2, 1, 'definition 2', 'answer 2')
    await db.words.add(word2)
    const word3 = new Word(2, 2, 'definition 3', 'answer 3')
    await db.words.add(word3)
  })

  it('should return null title and empty words when deckId is null', async () => {
    const deckId = null
    const { result } = renderHook(() => useDeck(deckId))
    await waitFor(() => {
      expect(result.current.title).toBeNull()
      expect(result.current.words).toEqual([])
    })
  })

  it('should return deck title and words when deckId is not null', async () => {
    const deckId = 2
    const { result } = renderHook(() => useDeck(deckId))
    await waitFor(() => {
      expect(result.current.title).toBe('deck 2')
      expect(result.current.words.length).toBe(2)
    })
  })
})