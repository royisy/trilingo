import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { db } from '../db'
import { AppSetting } from '../models/AppSetting'
import { Deck } from '../models/Deck'
import { Word } from '../models/Word'
import { Home } from './Home'

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
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText('Trilingo')).toBeInTheDocument()
    expect(screen.queryByText('Practice')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('deck 1')).toBeInTheDocument()
      expect(screen.getByText('Practice')).toBeInTheDocument()
      const liElement1 = container.querySelector(
        '[data-tooltip-id="deck-progress-tooltip-1"]'
      )
      expect(liElement1).toBeInTheDocument()
      const liElement2 = container.querySelector(
        '[data-tooltip-id="deck-progress-tooltip-2"]'
      )
      expect(liElement2).toBeInTheDocument()
    })
  })
})
