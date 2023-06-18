import { act, renderHook } from '@testing-library/react'
import { useCorrectMark } from './useCorrectMark'

describe('useCorrectMark', () => {
  it('should return isCorrect as true after showCorrect is called', async () => {
    const { result } = renderHook(() => useCorrectMark(0))
    expect(result.current.showCorrect).toBe(false)
    act(() => {
      result.current.triggerShowCorrect()
    })
    expect(result.current.showCorrect).toBe(true)
  })
})
