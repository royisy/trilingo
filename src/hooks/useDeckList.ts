import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { type CsvDeck } from '../models/CsvDeck'
import { getAllDecks } from '../repositories/deck'
import { getCsv } from '../utils/csvUtils'

export const useDeckList = (): {
  deckListToAdd: CsvDeck[]
  isLoading: boolean
} => {
  const [deckList, setDeckList] = useState<CsvDeck[]>([])
  const decks = useLiveQuery(getAllDecks)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getDeckList = async (): Promise<void> => {
      const deckListFromCsv = await getCsv<CsvDeck>('deck-list.csv')
      setIsLoading(false)
      setDeckList(deckListFromCsv)
    }
    void getDeckList()
  }, [])

  const deckIds = decks?.map((deck) => deck.id)
  const deckListToAdd = deckList.filter(
    (csvDeck) => deckIds?.includes(csvDeck.id) === false
  )

  return { deckListToAdd, isLoading }
}
