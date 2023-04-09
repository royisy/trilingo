import { renderHook, waitFor } from '@testing-library/react'
import { db } from '../db'
import { Deck } from '../models/Deck'
import { Word } from '../models/Word'
import { useDeleteDeck } from './useDeleteDeck'

describe('useDeleteDeck', () => {
  beforeAll(async () => {
    const deck1 = new Deck(1, 'deck 1')
    await db.decks.add(deck1)
    const word1 = new Word(1, 1, 'definition 1', 'answer 1')
    await db.words.add(word1)
    const deck2 = new Deck(2, 'deck 2')
    await db.decks.add(deck2)
    const word2 = new Word(2, 1, 'definition 2', 'answer 2')
    await db.words.add(word2)
  })

  it('should delete a deck', async () => {
    const deck = await db.decks.get(1)
    expect(deck).not.toBeUndefined()
    if (deck == null) return
    const { result } = renderHook(() => useDeleteDeck())
    await waitFor(async () => {
      await result.current(deck)
    })
    const deck1 = await db.decks.get(1)
    expect(deck1).toBeUndefined()
    const word1 = await db.words.get(1)
    expect(word1).toBeUndefined()
    const deck2 = await db.decks.get(2)
    expect(deck2).not.toBeUndefined()
  })
})
