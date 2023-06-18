import { useEffect, useState } from 'react'
import { getAppSetting } from '../repositories/appSetting'

export const useSelectedDeckStatus = (): boolean | null => {
  const [isDeckSelected, setIsDeckSelected] = useState<boolean | null>(null)

  useEffect(() => {
    const getSelectedDeck = async (): Promise<void> => {
      const appSetting = await getAppSetting()
      const deckId = appSetting.selectedDeckId
      setIsDeckSelected(deckId != null)
    }
    void getSelectedDeck()
  }, [])

  return isDeckSelected
}
