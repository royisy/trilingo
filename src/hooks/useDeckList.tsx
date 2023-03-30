import { useEffect, useState } from 'react'
import { getCsv } from '../utils/csvUtils'

export const useDeckList = (): Array<{ id: number; title: string }> => {
  const [deckList, setDeckList] = useState<
    Array<{ id: number; title: string }>
  >([])

  useEffect(() => {
    void getCsv<{ id: number; title: string }>('/deck-list.csv').then((csv) => {
      setDeckList(csv)
    })
  }, [])

  return deckList
}
