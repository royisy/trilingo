import { renderHook, waitFor } from '@testing-library/react'
import { db } from '../db'
import { AppSetting } from '../models/AppSetting'
import { useSelectedDeckStatus } from './useSelectedDeckStatus'

describe('useSelectedDeckStatus', () => {
  it('should return false when deck is not selected', async () => {
    const { result } = renderHook(() => useSelectedDeckStatus())
    expect(result.current).toBeNull()
    await waitFor(() => {
      expect(result.current).toEqual(false)
    })
  })

  it('should return true when deck is selected', async () => {
    const appSetting = new AppSetting()
    appSetting.selectedDeckId = 1
    await db.appSettings.add(appSetting)

    const { result } = renderHook(() => useSelectedDeckStatus())
    expect(result.current).toBeNull()
    await waitFor(() => {
      expect(result.current).toEqual(true)
    })
  })
})
