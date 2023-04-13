import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useState } from 'react'
import { type CsvDeck } from '../models/CsvDeck'
import { getAllDecks } from '../repositories/deck'
import { getCsv } from '../utils/csvUtils'

export const useDeckList = (): CsvDeck[] => {
  const [deckList, setDeckList] = useState<CsvDeck[]>([])
  const decks = useLiveQuery(getAllDecks)

  useEffect(() => {
    const getDeckList = async (): Promise<void> => {
      const deckList = await getCsv<CsvDeck>('/deck-list.csv')
      setDeckList(deckList)
    }
    void getDeckList()
  }, [])

  const deckListToAdd = useMemo(() => {
    const deckIds = decks?.map((deck) => deck.id)
    return deckList.filter((csvDeck) => deckIds?.includes(csvDeck.id) === false)
  }, [deckList, decks])

  return deckListToAdd
}
