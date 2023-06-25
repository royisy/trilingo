import { renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { db } from '../db'
import { Deck } from '../models/Deck'
import { useAddDeckDialog } from './useAddDeckDialog'

describe('useAddDeckDialog', () => {
  const setMenuComponent = vi.fn()

  it('should show add deck dialog when there is no deck', async () => {
    const { result } = renderHook(() =>
      useAddDeckDialog(setMenuComponent, false, vi.fn())
    )
    expect(result.current.showAddDeckDialog).toBe(false)
    await waitFor(() => {
      expect(result.current.showAddDeckDialog).toBe(true)
    })
  })

  it('should not show add deck dialog when there is a deck', async () => {
    const deck = new Deck(1, 'language 1', 'deck 1')
    await db.decks.add(deck)
    const { result } = renderHook(() =>
      useAddDeckDialog(setMenuComponent, false, vi.fn())
    )
    expect(result.current.showAddDeckDialog).toBe(false)
    await waitFor(() => {
      expect(result.current.showAddDeckDialog).toBe(false)
    })
  })
})
