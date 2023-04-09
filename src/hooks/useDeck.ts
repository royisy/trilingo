import { useEffect, useState } from 'react'
import { type Word } from '../models/Word'
import { getDeckById } from '../repositories/deck'

export const useDeck = (
  deckId: number | null
): {
  title: string | null
  words: Word[]
} => {
  const [title, setTitle] = useState<string | null>(null)
  const [words, setWords] = useState<Word[]>([])

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
