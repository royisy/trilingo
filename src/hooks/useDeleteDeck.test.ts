import { renderHook, waitFor } from '@testing-library/react'
import { db } from '../db'
import { AppSetting } from '../models/AppSetting'
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
    const deck3 = new Deck(3, 'deck 3')
    await db.decks.add(deck3)
    const deck4 = new Deck(4, 'deck 4')
    await db.decks.add(deck4)
  })

  it('should delete a deck', async () => {
    const deck = await db.decks.get(1)
    expect(deck).toBeDefined()
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
    expect(deck2).toBeDefined()
  })

  it('should set selectedDeckId null when a deck is deleted', async () => {
    const appSetting = new AppSetting()
    appSetting.selectedDeckId = 3
    await appSetting.save()
    const deck = await db.decks.get(3)
    expect(deck).toBeDefined()
    if (deck == null) return
    const { result } = renderHook(() => useDeleteDeck())
    await waitFor(async () => {
      await result.current(deck)
    })
    const updatedAppSetting = await db.appSettings.get(1)
    expect(updatedAppSetting?.selectedDeckId).toBeNull()
  })

  it('should not set selectedDeckId null when a deck is deleted', async () => {
    const appSetting = await db.appSettings.get(1)
    expect(appSetting).toBeDefined()
    if (appSetting == null) return
    appSetting.selectedDeckId = 2
    await appSetting.save()
    const deck = await db.decks.get(4)
    expect(deck).toBeDefined()
    if (deck == null) return
    const { result } = renderHook(() => useDeleteDeck())
    await waitFor(async () => {
      await result.current(deck)
    })
    const updatedAppSetting = await db.appSettings.get(1)
    expect(updatedAppSetting?.selectedDeckId).toBe(2)
  })
})
