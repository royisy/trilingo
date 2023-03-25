import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as router from 'react-router'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { db } from '../db'
import { Deck } from '../models/Deck'
import { AddDeck } from './AddDeck'

vi.mock('../utils/csvUtils', () => ({
  getCsv: async (filename: string) => {
    if (filename === '/deck-list.csv') {
      return [
        { id: 1, title: 'deck 1' },
        { id: 2, title: 'deck 2' },
        { id: 3, title: 'deck 3' },
      ]
    } else if (filename === '/decks/2.csv') {
      return [
        { no: 1, definition: 'definition 1', answer: 'answer 1' },
        { no: 2, definition: 'definition 2', answer: 'answer 2' },
      ]
    }
  },
}))

describe('AddDeck', () => {
  it('should list decks that are not in database', async () => {
    const deck1 = new Deck(1, 'deck 1')
    await db.decks.add(deck1)
    render(
      <MemoryRouter>
        <AddDeck />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.queryByText('deck 1')).not.toBeInTheDocument()
      expect(screen.getByText('deck 2')).toBeInTheDocument()
      expect(screen.getByText('deck 3')).toBeInTheDocument()
    })
  })

  it('should add deck and words to database when the deck is clicked', async () => {
    const navigate = vi.fn()
    vi.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
    render(
      <MemoryRouter>
        <AddDeck />
      </MemoryRouter>
    )
    const deck2Element = await screen.findByText('deck 2')
    fireEvent.click(deck2Element)
    await waitFor(async () => {
      const decks = await db.decks.toArray()
      expect(decks).toHaveLength(2)
      expect(decks[0].id).toBe(1)
      expect(decks[0].title).toBe('deck 1')
      expect(decks[1].id).toBe(2)
      expect(decks[1].title).toBe('deck 2')
      const words = await db.words.toArray()
      expect(words).toHaveLength(2)
      expect(words[0].deckId).toBe(2)
      expect(words[0].no).toBe(1)
      expect(words[0].definition).toBe('definition 1')
      expect(words[0].answer).toBe('answer 1')
      expect(words[1].deckId).toBe(2)
      expect(words[1].no).toBe(2)
      expect(words[1].definition).toBe('definition 2')
      expect(words[1].answer).toBe('answer 2')
      expect(navigate).toHaveBeenCalledWith('/menu')
    })
  })

  afterAll(async () => {
    await db.decks.clear()
    await db.words.clear()
  })
})
