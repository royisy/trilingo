import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { AppSetting } from '../models/AppSetting'
import { Deck } from '../models/Deck'
import { Word } from '../models/Word'
import { Home } from './Home'

vi.mock('../repositories/appSetting', () => ({
  getAppSetting: () => {
    const appSetting = new AppSetting()
    appSetting.selectedDeckId = 1
    return appSetting
  },
}))

vi.mock('../repositories/deck', () => ({
  getDeckById: () => new Deck(1, 'Deck title'),
}))

vi.mock('../repositories/word', () => ({
  getWordsByDeckId: () => {
    const word1 = new Word(1, 1, 'definition 1', 'answer 1')
    word1.correctCnt = 0
    word1.skippedCnt = 0
    const word2 = new Word(1, 2, 'definition 2', 'answer 2')
    word2.correctCnt = 0
    word2.skippedCnt = 0
    return [word1, word2]
  },
}))

describe('Home', () => {
  it('should render deck title and words list', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText('Trilingo')).toBeInTheDocument()
    expect(screen.queryByText('Start')).not.toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByText('definition 1')).not.toBeInTheDocument()
    expect(screen.queryByText('answer 1')).not.toBeInTheDocument()
    expect(screen.queryByText('definition 2')).not.toBeInTheDocument()
    expect(screen.queryByText('answer 2')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Deck title')).toBeInTheDocument()
      expect(screen.getByText('Start')).toBeInTheDocument()
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('definition 1')).toBeInTheDocument()
      expect(screen.queryByText('answer 1')).toBeInTheDocument()
      expect(screen.getByText('definition 2')).toBeInTheDocument()
      expect(screen.queryByText('answer 2')).toBeInTheDocument()
    })
  })
})
