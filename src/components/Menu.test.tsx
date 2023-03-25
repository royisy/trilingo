import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as router from 'react-router'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { db } from '../db'
import { Deck } from '../models/Deck'
import { Menu } from './Menu'

describe('Menu', () => {
  it('should not render deck list', () => {
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    )
    expect(screen.getByText('Menu')).toBeInTheDocument()
    expect(screen.queryByText('deck 1')).not.toBeInTheDocument()
  })

  it('should render deck list', async () => {
    const deck1 = new Deck(1, 'deck 1')
    await db.decks.add(deck1)
    const deck2 = new Deck(2, 'deck 2')
    await db.decks.add(deck2)
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    )
    expect(screen.getByText('Menu')).toBeInTheDocument()
    expect(screen.queryByText('deck 1')).not.toBeInTheDocument()
    expect(screen.queryByText('deck 2')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('deck 1')).toBeInTheDocument()
      expect(screen.getByText('deck 2')).toBeInTheDocument()
    })
  })

  it('should set selectedDeckId and navigate to home when deck is selected', async () => {
    const navigate = vi.fn()
    vi.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    )
    const deck1Element = await screen.findByText('deck 1')
    fireEvent.click(deck1Element)
    await waitFor(async () => {
      const appSetting = await db.appSettings.get(1)
      expect(appSetting?.selectedDeckId).toBe(1)
      expect(navigate).toHaveBeenCalledWith('/')
    })
  })
})
