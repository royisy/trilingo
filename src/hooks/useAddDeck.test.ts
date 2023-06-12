import { renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { db } from '../db'
import { Deck } from '../models/Deck'
import { useAddDeck } from './useAddDeck'

vi.mock('../utils/csvUtils', () => ({
  getCsv: async (filename: string) => {
    return [
      { no: 1, definition: 'definition 1', answer: 'answer 1' },
      { no: 2, definition: 'definition 2', answer: 'answer 2' },
    ]
  },
}))

describe('useAddDeck', () => {
  it('should not add a new deck if the deck already exists', async () => {
    const deck1 = new Deck(1, 'language 1', 'deck 1')
    await db.decks.add(deck1)
    const csvDeck = { id: 1, language: 'language 1', title: 'deck 1' }
    const { result } = renderHook(() => useAddDeck())
    expect(result.current.isLoading).toBe(false)
    await waitFor(async () => {
      await expect(result.current.addDeck(csvDeck)).resolves.toBe(false)
    })
  })

  it('should add a new deck if the deck does not exist', async () => {
    const csvDeck = { id: 2, language: 'language 2', title: 'deck 2' }
    const { result } = renderHook(() => useAddDeck())
    expect(result.current.isLoading).toBe(false)
    await waitFor(async () => {
      await expect(result.current.addDeck(csvDeck)).resolves.toBe(true)
    })
    expect(result.current.isLoading).toBe(false)
    const deck2 = await db.decks.get(2)
    expect(deck2).not.toBeUndefined()
    expect(deck2?.title).toBe('deck 2')
    const words = await db.words.toArray()
    expect(words.length).toBe(2)
    expect(words[0].deckId).toBe(2)
    expect(words[0].no).toBe(1)
    expect(words[0].definition).toBe('definition 1')
    expect(words[0].answer).toBe('answer 1')
    expect(words[1].deckId).toBe(2)
    expect(words[1].no).toBe(2)
    expect(words[1].definition).toBe('definition 2')
    expect(words[1].answer).toBe('answer 2')
    const appSettings = await db.appSettings.get(1)
    expect(appSettings?.selectedDeckId).toBe(2)
  })
})
