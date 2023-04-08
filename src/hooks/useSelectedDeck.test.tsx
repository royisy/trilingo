import { renderHook, waitFor } from '@testing-library/react'
import { db } from '../db'
import { AppSetting } from '../models/AppSetting'
import { Deck } from '../models/Deck'
import { useSelectedDeck } from './useSelectedDeck'

describe('useSelectedDeck', () => {
  beforeAll(async () => {
    const deck1 = new Deck(1, 'deck 1')
    await db.decks.add(deck1)
    const deck2 = new Deck(2, 'deck 2')
    await db.decks.add(deck2)
  })

  it('should return null and false initially', () => {
    const { result } = renderHook(() => useSelectedDeck())
    expect(result.current.selectedDeck).toBe(null)
    expect(result.current.noDeckSelected).toBe(false)
  })

  it('should return selectedDeck and false when deck is selected', async () => {
    const appSetting = new AppSetting()
    appSetting.selectedDeckId = 2
    await db.appSettings.add(appSetting)
    const { result } = renderHook(() => useSelectedDeck())
    await waitFor(() => {
      expect(result.current.selectedDeck?.id).toBe(2)
      expect(result.current.noDeckSelected).toBe(false)
    })
  })

  it('should return null and true when deck is not selected', async () => {
    const appSetting = await db.appSettings.get(1)
    expect(appSetting).not.toBeNull()
    if (appSetting == null) return
    appSetting.selectedDeckId = null
    await db.appSettings.put(appSetting)
    const { result } = renderHook(() => useSelectedDeck())
    await waitFor(() => {
      expect(result.current.selectedDeck).toBe(null)
      expect(result.current.noDeckSelected).toBe(true)
    })
  })
})
