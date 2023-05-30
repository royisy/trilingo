import { useCallback, useState } from 'react'
import { type CsvDeck } from '../models/CsvDeck'
import { type CsvWord } from '../models/CsvWord'
import { Deck } from '../models/Deck'
import { Word } from '../models/Word'
import { getAppSetting } from '../repositories/appSetting'
import { getDeckById } from '../repositories/deck'
import { getCsv } from '../utils/csvUtils'

export const useAddDeck = (): {
  addDeck: (csvDeck: CsvDeck) => Promise<boolean>
  isLoading: boolean
} => {
  const [isLoading, setIsLoading] = useState(false)

  const addDeck = useCallback(async (csvDeck: CsvDeck): Promise<boolean> => {
    setIsLoading(true)
    const deck = await getDeckById(csvDeck.id)
    if (deck != null) {
      setIsLoading(false)
      return false
    }

    const csvWords = await getCsv<CsvWord>(`decks/${csvDeck.id}.csv`)
    const words = csvWords.map(
      (csvWord) =>
        new Word(csvDeck.id, csvWord.no, csvWord.definition, csvWord.answer)
    )
    const newDeck = new Deck(csvDeck.id, csvDeck.title)
    await newDeck.save(words)
    const appSetting = await getAppSetting()
    appSetting.selectedDeckId = newDeck.id
    await appSetting.save()
    setIsLoading(false)
    return true
  }, [])

  return { addDeck, isLoading }
}
