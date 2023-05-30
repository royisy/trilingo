import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { MenuContext } from '../contexts/MenuContext'
import { db } from '../db'
import { Deck } from '../models/Deck'
import { DeleteDeck } from './DeleteDeck'

describe('DeleteDeck', () => {
  it('should list decks that are in database', async () => {
    const deck1 = new Deck(1, 'deck 1')
    await db.decks.add(deck1)
    const deck2 = new Deck(2, 'deck 2')
    await db.decks.add(deck2)
    render(<DeleteDeck />)
    await waitFor(() => {
      expect(screen.getByText('deck 1')).toBeInTheDocument()
      expect(screen.getByText('deck 2')).toBeInTheDocument()
    })
  })

  it('should call setDeckToDelete with selected deck', async () => {
    const mockSetMenuComponent = vi.fn()
    const mockToggleDrawerOpen = vi.fn()
    const mockSetDeckToDelete = vi.fn()
    render(
      <MenuContext.Provider
        value={{
          setMenuComponent: mockSetMenuComponent,
          toggleDrawerOpen: mockToggleDrawerOpen,
          setDeckToDelete: mockSetDeckToDelete,
        }}
      >
        <DeleteDeck />
      </MenuContext.Provider>
    )
    const deck1Element = await screen.findByText('deck 1')
    const parentLiElement = deck1Element.parentElement
    const svgElement = parentLiElement?.querySelector('svg')
    expect(svgElement).not.toBeNull()
    if (svgElement == null) return
    fireEvent.click(svgElement)
    expect(mockSetDeckToDelete).toHaveBeenCalledWith(new Deck(1, 'deck 1'))
  })
})
