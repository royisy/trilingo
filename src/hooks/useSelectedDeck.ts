import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { type Word } from '../models/Word'
import { getAppSetting } from '../repositories/appSetting'
import { getDeckById } from '../repositories/deck'

export const useSelectedDeck = (): {
  title: string | null
  words: Word[]
} => {
  const appSetting = useLiveQuery(getAppSetting)
  const deckId = appSetting?.selectedDeckId ?? null
  const [title, setTitle] = useState<string | null>(null)
  const [words, setWords] = useState<Word[]>([])

  useEffect(() => {
    const getDeck = async (): Promise<void> => {
      if (deckId == null) {
        setTitle(null)
        setWords([])
        return
      }
      const deck = await getDeckById(deckId)
      if (deck == null) {
        throw new Error('Incorrect deck id.')
      }
      const words = await deck.words
      setTitle(deck.title)
      setWords(words)
    }
    void getDeck()
  }, [deckId])

  return { title, words }
}
