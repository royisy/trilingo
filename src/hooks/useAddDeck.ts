import { useCallback } from 'react'
import { type CsvDeck } from '../models/CsvDeck'
import { type CsvWord } from '../models/CsvWord'
import { Deck } from '../models/Deck'
import { Word } from '../models/Word'
import { getDeckById } from '../repositories/deck'
import { getCsv } from '../utils/csvUtils'

export const useAddDeck = (): ((csvDeck: CsvDeck) => Promise<boolean>) => {
  const addDeck = useCallback(async (csvDeck: CsvDeck): Promise<boolean> => {
    const deck = await getDeckById(csvDeck.id)
    if (deck != null) {
      return false
    }

    const csvWords = await getCsv<CsvWord>(`/decks/${csvDeck.id}.csv`)
    const words = csvWords.map(
      (csvWord) =>
        new Word(csvDeck.id, csvWord.no, csvWord.definition, csvWord.answer)
    )
    const newDeck = new Deck(csvDeck.id, csvDeck.title)
    await newDeck.save(words)
    return true
  }, [])

  return addDeck
}
