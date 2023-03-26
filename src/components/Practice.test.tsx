import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as router from 'react-router'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { db } from '../db'
import { AppSetting } from '../models/AppSetting'
import { Deck } from '../models/Deck'
import { Word } from '../models/Word'
import { Practice } from './Practice'

describe('Practice', () => {
  beforeAll(async () => {
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
  })

  it('should move to home if no deck is selected', async () => {
    const navigate = vi.fn()
    vi.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
    const appSetting = new AppSetting()
    appSetting.selectedDeckId = null
    await db.appSettings.add(appSetting)

    render(
      <MemoryRouter>
        <Practice />
      </MemoryRouter>
    )

    await waitFor(async () => {
      expect(navigate).toHaveBeenCalledWith('/')
    })
  })

  it('should show word definition and check answer', async () => {
    const appSetting = await db.appSettings.get(1)
    expect(appSetting).not.toBeNull()
    if (appSetting == null) return
    appSetting.selectedDeckId = 1
    await db.appSettings.put(appSetting)

    render(
      <MemoryRouter>
        <Practice />
      </MemoryRouter>
    )

    await waitFor(async () => {
      expect(screen.getByText('1 / 2')).toBeInTheDocument()
      expect(screen.getByText(/^definition/)).toBeInTheDocument()
    })

    // answer first word
    const definitionElement = screen.getByText(/^definition/)
    const definition = definitionElement.textContent
    if (definition == null) return
    const answer = definition.replace('definition', 'answer')
    const inputElement = screen.getByRole('textbox')
    fireEvent.change(inputElement, { target: { value: answer } })
    await waitFor(async () => {
      expect(screen.getByText('2 / 2')).toBeInTheDocument()
      expect(screen.queryByText(definition)).not.toBeInTheDocument()
      expect(screen.getByText('Correct!')).toBeInTheDocument()
    })
  })
})
