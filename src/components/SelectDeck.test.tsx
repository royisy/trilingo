import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { db } from '../db'
import { Deck } from '../models/Deck'
import { MenuComponentContext } from './Menu'
import { SelectDeck } from './SelectDeck'

describe('SelectDeck', () => {
  it('should not render deck list', async () => {
    const deck1 = new Deck(1, 'deck 1')
    await db.decks.add(deck1)
    const deck2 = new Deck(2, 'deck 2')
    await db.decks.add(deck2)
    render(<SelectDeck />)
    expect(screen.queryByText('deck 1')).not.toBeInTheDocument()
  })

  it('should render deck list', async () => {
    render(<SelectDeck />)
    expect(screen.queryByText('deck 1')).not.toBeInTheDocument()
    expect(screen.queryByText('deck 2')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('deck 1')).toBeInTheDocument()
      expect(screen.getByText('deck 2')).toBeInTheDocument()
    })
  })

  it('should set selectedDeckId when deck is selected', async () => {
    render(<SelectDeck />)
    const deck1Element = await screen.findByText('deck 1')
    fireEvent.click(deck1Element)
    await waitFor(async () => {
      const appSetting = await db.appSettings.get(1)
      expect(appSetting?.selectedDeckId).toBe(1)
    })
  })

  it('should set menu component to add-deck', () => {
    const mockSetMenuComponent = vi.fn()
    render(
      <MenuComponentContext.Provider value={mockSetMenuComponent}>
        <SelectDeck />
      </MenuComponentContext.Provider>
    )
    const buttons = screen.getAllByRole('button')
    const addButton = buttons[0]
    fireEvent.click(addButton)
    expect(mockSetMenuComponent).toHaveBeenCalledWith('add-deck')
  })

  it('should set menu component to delete-deck', () => {
    const mockSetMenuComponent = vi.fn()
    render(
      <MenuComponentContext.Provider value={mockSetMenuComponent}>
        <SelectDeck />
      </MenuComponentContext.Provider>
    )
    const buttons = screen.getAllByRole('button')
    const addButton = buttons[1]
    fireEvent.click(addButton)
    expect(mockSetMenuComponent).toHaveBeenCalledWith('delete-deck')
  })
})
