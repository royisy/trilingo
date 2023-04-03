import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { type Word } from '../models/Word'
import { getAppSetting } from '../repositories/appSetting'
import { getDeckById } from '../repositories/deck'

export const useDeck = (): {
  title: string | null
  words: Word[]
} => {
  const [title, setTitle] = useState<string | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const appSetting = useLiveQuery(getAppSetting)
  const deckId = appSetting?.selectedDeckId

  useEffect(() => {
    const getDeck = async (): Promise<void> => {
      if (deckId == null) {
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