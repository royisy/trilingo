import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { type Deck } from '../models/Deck'
import { type Word } from '../models/Word'
import { getAppSetting } from '../repositories/appSetting'
import { getDeckById } from '../repositories/deck'

export const useSelectedDeck = (): {
  selectedDeck: Deck | null
  words: Word[]
} => {
  const appSetting = useLiveQuery(getAppSetting)
  const deckId = appSetting?.selectedDeckId ?? null
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null)
  const [words, setWords] = useState<Word[]>([])

  useEffect(() => {
    const getDeck = async (): Promise<void> => {
      if (deckId == null) {
        setSelectedDeck(null)
        setWords([])
        return
      }
      const deck = await getDeckById(deckId)
      if (deck == null) {
        throw new Error('Incorrect deck id.')
      }
      const words = await deck.words
      setSelectedDeck(deck)
      setWords(words)
    }
    void getDeck()
  }, [deckId])

  return { selectedDeck, words }
}
