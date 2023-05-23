import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useContext } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { MenuContext } from '../contexts/MenuContext'
import { db } from '../db'
import { AppSetting } from '../models/AppSetting'
import { Deck } from '../models/Deck'
import { Word } from '../models/Word'
import { Home } from './Home'

vi.mock('./Menu', () => {
  const Menu = (): JSX.Element => {
    const { setMenuComponent } = useContext(MenuContext)

    return (
      <>
        <h1> Menu component </h1>
        <button
          onClick={() => {
            setMenuComponent('add-deck')
          }}
        >
          Add deck
        </button>
        <button
          onClick={() => {
            setMenuComponent('delete-deck')
          }}
        >
          Delete deck
        </button>
      </>
    )
  }

  return { Menu }
})

vi.mock('./AddDeck', () => {
  const AddDeck = (): JSX.Element => <h1>AddDeck component</h1>
  AddDeck.displayName = 'AddDeck'
  return { AddDeck }
})

vi.mock('./DeleteDeck', () => {
  const DeleteDeck = (): JSX.Element => <h1>DeleteDeck component</h1>
  DeleteDeck.displayName = 'DeleteDeck'
  return { DeleteDeck }
})

describe('Home', () => {
  it('should render deck title and words list', async () => {
    const appSetting = new AppSetting()
    appSetting.selectedDeckId = 1
    await db.appSettings.add(appSetting)
    const deck = new Deck(1, 'deck 1')
    await db.decks.add(deck)
    const word1 = new Word(1, 1, 'definition 1', 'answer 1')
    word1.correctCnt = 0
    word1.skippedCnt = 0
    await db.words.add(word1)
    const word2 = new Word(1, 2, 'definition 2', 'answer 2')
    word2.correctCnt = 0
    word2.skippedCnt = 0
    await db.words.add(word2)
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.queryByText('Practice')).not.toBeInTheDocument()
    await waitFor(() => {
      const elements = screen.getAllByText('deck 1')
      expect(elements.length).toBeGreaterThan(0)
      expect(screen.getByText('Practice')).toBeInTheDocument()
      const liElement1 = document.querySelector(
        '[data-definition="definition 1 / answer 1"]'
      )
      expect(liElement1).toBeInTheDocument()
      const liElement2 = document.querySelector(
        '[data-definition="definition 2 / answer 2"]'
      )
      expect(liElement2).toBeInTheDocument()
    })
  })

  it('should render Menu by default and can switch to AddDeck', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText('Menu component')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Add deck'))
    expect(screen.getByText('AddDeck component')).toBeInTheDocument()
  })

  it('should render Menu by default and can switch to DeleteDeck', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText('Menu component')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Delete deck'))
    expect(screen.getByText('DeleteDeck component')).toBeInTheDocument()
  })
})
