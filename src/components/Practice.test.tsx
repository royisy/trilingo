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

  let navigate: any
  beforeEach(async () => {
    navigate = vi.fn()
    vi.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
  })

  it('should move to home if no deck is selected', async () => {
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
    expect(appSetting).not.toBeUndefined()
    if (appSetting == null) return
    appSetting.selectedDeckId = 1
    await db.appSettings.put(appSetting)

    render(
      <MemoryRouter>
        <Practice />
      </MemoryRouter>
    )

    await waitFor(async () => {
      const progress = screen.getByRole('progressbar')
      expect(progress).toHaveAttribute('value', '1')
      expect(progress).toHaveAttribute('max', '2')
      expect(screen.getByText(/^definition/)).toBeInTheDocument()
      expect(screen.getByText('Skip')).toBeInTheDocument()
      expect(screen.queryByText('Next')).not.toBeInTheDocument()
    })

    // answer first word
    const definitionElement = screen.getByText(/^definition/)
    const definition = definitionElement.textContent
    expect(definition).not.toBeNull()
    if (definition == null) return
    const answer = definition.replace('definition', 'answer')
    const inputElement = screen.getByRole('textbox')
    fireEvent.change(inputElement, { target: { value: answer } })
    await waitFor(async () => {
      const progress = screen.getByRole('progressbar')
      expect(progress).toHaveAttribute('value', '2')
      expect(progress).toHaveAttribute('max', '2')
      expect(screen.queryByText(definition)).not.toBeInTheDocument()
      expect(screen.getByText('Correct!')).toBeInTheDocument()
      expect(screen.getByText('Skip')).toBeInTheDocument()
      expect(screen.queryByText('Next')).not.toBeInTheDocument()
      const words = await db.words.toArray()
      const word = words.find((w) => w.definition === definition)
      expect(word?.correctCnt).toBe(1)
      expect(word?.skippedCnt).toBe(0)
    })

    // skip second word
    const skipButtonElement = screen.getByText('Skip')
    fireEvent.click(skipButtonElement)
    await waitFor(async () => {
      const progress = screen.getByRole('progressbar')
      expect(progress).toHaveAttribute('value', '2')
      expect(progress).toHaveAttribute('max', '2')
      expect(screen.getByText(/^answer/)).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeDisabled()
      expect(screen.getByText('Next')).toBeInTheDocument()
      expect(screen.queryByText('Skip')).not.toBeInTheDocument()
      const words = await db.words.toArray()
      const word = words.find((w) => w.definition !== definition)
      expect(word?.correctCnt).toBe(0)
      expect(word?.skippedCnt).toBe(1)
    })

    // click next button
    const nextButtonElement = screen.getByText('Next')
    fireEvent.click(nextButtonElement)
    await waitFor(async () => {
      expect(navigate).toHaveBeenCalledWith('/')
    })
  })
})
