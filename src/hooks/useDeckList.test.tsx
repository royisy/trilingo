import { renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { getCsv } from '../utils/csvUtils'
import { useDeckList } from './useDeckList'

vi.mock('../utils/csvUtils')

describe('useDeckList', () => {
  it('should fetch and return the deck list from the csv file', async () => {
    const mockCsvData = [
      { id: 1, title: 'deck 1' },
      { id: 2, title: 'deck 2' },
    ]
    const mockedGetCsv = getCsv as jest.MockedFunction<typeof getCsv>
    mockedGetCsv.mockResolvedValue(mockCsvData)
    const { result } = renderHook(() => useDeckList())
    await waitFor(() => {
      expect(getCsv).toHaveBeenCalledWith('/deck-list.csv')
      expect(result.current).toEqual(mockCsvData)
    })
  })
})
