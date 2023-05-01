import { renderHook, waitFor } from '@testing-library/react'
import { useCorrectMark } from './useCorrectMark'

describe('useCorrectMark', () => {
  it('should set isCorrect true after showCorrect is executed', async () => {
    const { result } = renderHook(() => useCorrectMark(0))
    expect(result.current.isCorrect).toBe(false)
    await waitFor(() => {
      result.current.showCorrect()
    })
    expect(result.current.isCorrect).toBe(true)
    await waitFor(() => {
      expect(result.current.isCorrect).toBe(false)
    })
  })
})
