import { renderHook, waitFor } from '@testing-library/react'
import { db } from '../db'
import { AppSetting } from '../models/AppSetting'
import { Deck } from '../models/Deck'
import { useSelectDeck } from './useSelectDeck'

describe('useSelectDeck', () => {
  it('should update selectedDeckId', async () => {
    const appSetting = new AppSetting()
    appSetting.selectedDeckId = 1
    await db.appSettings.add(appSetting)
    const deck = new Deck(2, 'deck 2')
    const { result } = renderHook(() => useSelectDeck())
    await waitFor(async () => {
      await expect(result.current(deck)).resolves.toBeUndefined()
    })
    const updatedAppSetting = await db.appSettings.get(1)
    expect(updatedAppSetting?.selectedDeckId).toBe(2)
  })
})
