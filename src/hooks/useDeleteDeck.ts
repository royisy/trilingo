import { useCallback } from 'react'
import { type Deck } from '../models/Deck'
import { getAppSetting } from '../repositories/appSetting'

export const useDeleteDeck = (): ((deck: Deck) => Promise<void>) => {
  const deleteDeck = useCallback(async (deck: Deck): Promise<void> => {
    const appSetting = await getAppSetting()
    if (appSetting.selectedDeckId === deck.id) {
      appSetting.selectedDeckId = null
      await appSetting.save()
    }
    await deck.delete()
  }, [])

  return deleteDeck
}
