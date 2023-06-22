import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { MenuContext } from '../contexts/MenuContext'
import { db } from '../db'
import { Deck } from '../models/Deck'
import { Menu } from './Menu'

describe('Menu', () => {
  const mockSetMenuComponent = vi.fn()
  const mockToggleDrawerOpen = vi.fn()
  const mockSetDeckToDelete = vi.fn()
  const mockOpenDialog = vi.fn()

  beforeAll(async () => {
    const deck1 = new Deck(1, 'language 1', 'deck 1')
    await db.decks.add(deck1)
    const deck2 = new Deck(2, 'language 2', 'deck 2')
    await db.decks.add(deck2)
  })

  it('should render deck list', async () => {
    render(<Menu />)
    expect(screen.queryByText('deck 1')).not.toBeInTheDocument()
    expect(screen.queryByText('deck 2')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('deck 1')).toBeInTheDocument()
      expect(screen.getByText('deck 2')).toBeInTheDocument()
    })
  })

  it('should set selectedDeckId when deck is selected', async () => {
    render(<Menu />)
    const deck1Element = await screen.findByText('deck 1')
    fireEvent.click(deck1Element)
    await waitFor(async () => {
      const appSetting = await db.appSettings.get(1)
      expect(appSetting?.selectedDeckId).toBe(1)
    })
  })

  it('should set menu component to add-deck', () => {
    render(
      <MenuContext.Provider
        value={{
          setMenuComponent: mockSetMenuComponent,
          menuComponent: 'menu',
          toggleDrawerOpen: mockToggleDrawerOpen,
          setDeckToDelete: mockSetDeckToDelete,
          openDialog: mockOpenDialog,
        }}
      >
        <Menu />
      </MenuContext.Provider>
    )
    const addButton = screen.getByTitle('Add Deck')
    fireEvent.click(addButton)
    expect(mockSetMenuComponent).toHaveBeenCalledWith('add-deck')
  })

  it('should set menu component to delete-deck', () => {
    render(
      <MenuContext.Provider
        value={{
          setMenuComponent: mockSetMenuComponent,
          menuComponent: 'menu',
          toggleDrawerOpen: mockToggleDrawerOpen,
          setDeckToDelete: mockSetDeckToDelete,
          openDialog: mockOpenDialog,
        }}
      >
        <Menu />
      </MenuContext.Provider>
    )
    const deleteButton = screen.getByTitle('Delete Deck')
    fireEvent.click(deleteButton)
    expect(mockSetMenuComponent).toHaveBeenCalledWith('delete-deck')
  })

  it('should set menu component to menu', () => {
    render(
      <MenuContext.Provider
        value={{
          setMenuComponent: mockSetMenuComponent,
          menuComponent: 'delete-deck',
          toggleDrawerOpen: mockToggleDrawerOpen,
          setDeckToDelete: mockSetDeckToDelete,
          openDialog: mockOpenDialog,
        }}
      >
        <Menu />
      </MenuContext.Provider>
    )
    const deleteButton = screen.getByTitle('Delete Deck')
    fireEvent.click(deleteButton)
    expect(mockSetMenuComponent).toHaveBeenCalledWith('menu')
  })

  it('should list decks to delete', async () => {
    render(
      <MenuContext.Provider
        value={{
          setMenuComponent: mockSetMenuComponent,
          menuComponent: 'delete-deck',
          toggleDrawerOpen: mockToggleDrawerOpen,
          setDeckToDelete: mockSetDeckToDelete,
          openDialog: mockOpenDialog,
        }}
      >
        <Menu />
      </MenuContext.Provider>
    )
    await waitFor(() => {
      expect(screen.getByText('deck 1')).toBeInTheDocument()
      expect(screen.getByText('deck 2')).toBeInTheDocument()
    })
  })

  it('should call setDeckToDelete with selected deck', async () => {
    render(
      <MenuContext.Provider
        value={{
          setMenuComponent: mockSetMenuComponent,
          menuComponent: 'delete-deck',
          toggleDrawerOpen: mockToggleDrawerOpen,
          setDeckToDelete: mockSetDeckToDelete,
          openDialog: mockOpenDialog,
        }}
      >
        <Menu />
      </MenuContext.Provider>
    )
    const deck1Element = await screen.findByText('deck 1')
    const parentLiElement = deck1Element.parentElement
    const svgElement = parentLiElement?.querySelector('svg')
    expect(svgElement).not.toBeNull()
    if (svgElement == null) return
    fireEvent.click(svgElement)
    expect(mockSetDeckToDelete).toHaveBeenCalledWith(
      new Deck(1, 'language 1', 'deck 1')
    )
  })
})
