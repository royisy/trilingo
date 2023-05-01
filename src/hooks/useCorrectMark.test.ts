import { renderHook, waitFor } from '@testing-library/react'
import { useMessage } from './useMessage'

describe('useMessage', () => {
  it('should set a message and reset it after timeout', async () => {
    const { result } = renderHook(() => useMessage(0))
    expect(result.current.message).toBe('')
    await waitFor(() => {
      result.current.showMessage('Hello, World!')
    })
    expect(result.current.message).toBe('Hello, World!')
    await waitFor(() => {
      result.current.showMessage('')
    })
  })
})
