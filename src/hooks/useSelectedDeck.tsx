import { useEffect, useState } from 'react'
import { type Deck } from '../models/Deck'
import { getAppSetting } from '../repositories/appSetting'
import { getDeckById } from '../repositories/deck'

export const useSelectedDeck = (): {
  selectedDeck: Deck | null
  noDeckSelected: boolean
} => {
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null)
  const [noDeckSelected, setNoDeckSelected] = useState<boolean>(false)

  useEffect(() => {
    const getSelectedDeck = async (): Promise<void> => {
      const appSetting = await getAppSetting()
      const deckId = appSetting.selectedDeckId
      if (deckId == null) {
        setNoDeckSelected(true)
      } else {
        setNoDeckSelected(false)
        const deck = await getDeckById(deckId)
        if (deck == null) {
          throw new Error('Deck not found.')
        }
        setSelectedDeck(deck)
      }
    }
    void getSelectedDeck()
  }, [])

  return { selectedDeck, noDeckSelected }
}
