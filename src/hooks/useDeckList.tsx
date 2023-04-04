import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { getAllDecks } from '../repositories/deck'
import { getCsv } from '../utils/csvUtils'

export const useDeckList = (): Array<{ id: number; title: string }> => {
  const [deckList, setDeckList] = useState<
    Array<{ id: number; title: string }>
  >([])
  const dbDecks = useLiveQuery(getAllDecks)

  const dbDeckIds = dbDecks?.map((deck) => deck.id)
  const deckListToAdd = deckList.filter(
    (row) => dbDeckIds?.includes(row.id) === false
  )

  useEffect(() => {
    const getDeckList = async (): Promise<void> => {
      const deckListCsv = await getCsv<{ id: number; title: string }>(
        '/deck-list.csv'
      )
      setDeckList(deckListCsv)
    }
    void getDeckList()
  }, [])

  return deckListToAdd
}
