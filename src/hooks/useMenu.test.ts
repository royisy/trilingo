import { act, renderHook } from '@testing-library/react'
import { useMenu } from './useMenu'

describe('useMenu', () => {
  it('should toggle drawerOpen', () => {
    const { result } = renderHook(() => useMenu())
    expect(result.current.drawerOpen).toBe(false)
    expect(result.current.menuComponent).toBe('menu')
    void act(() => {
      result.current.setMenuComponent('add-deck')
      result.current.toggleDrawerOpen()
    })
    expect(result.current.drawerOpen).toBe(true)
    expect(result.current.menuComponent).toBe('menu')
    void act(() => {
      result.current.toggleDrawerOpen()
    })
    expect(result.current.drawerOpen).toBe(false)
  })
})
