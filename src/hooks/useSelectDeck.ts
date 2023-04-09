import { useCallback } from 'react'
import { type Deck } from '../models/Deck'
import { getAppSetting } from '../repositories/appSetting'

export const useSelectDeck = (): ((deck: Deck) => Promise<void>) => {
  const selectDeck = useCallback(async (deck: Deck): Promise<void> => {
    const appSetting = await getAppSetting()
    appSetting.selectedDeckId = deck.id
    await appSetting.save()
  }, [])

  return selectDeck
}
