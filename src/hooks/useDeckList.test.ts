import { renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { db } from '../db'
import { Deck } from '../models/Deck'
import { getCsv } from '../utils/csvUtils'
import { useDeckList } from './useDeckList'

vi.mock('../utils/csvUtils')

describe('useDeckList', () => {
  it('should fetch deck list from CSV and filter decks that are not in the DB', async () => {
    const mockCsvData = [
      { id: 1, title: 'deck 1' },
      { id: 2, title: 'deck 2' },
      { id: 3, title: 'deck 3' },
    ]
    const expectedResult = [
      { id: 1, title: 'deck 1' },
      { id: 3, title: 'deck 3' },
    ]
    const deck2 = new Deck(2, 'language 2', 'deck 2')
    await db.decks.add(deck2)
    const mockedGetCsv = getCsv as jest.MockedFunction<typeof getCsv>
    mockedGetCsv.mockResolvedValue(mockCsvData)
    const { result } = renderHook(() => useDeckList())
    await waitFor(() => {
      expect(getCsv).toHaveBeenCalledWith('deck-list.csv')
      expect(result.current).toEqual(expectedResult)
    })
  })
})
