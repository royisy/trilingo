import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as router from 'react-router'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { db } from '../db'
import { AppSetting } from '../models/AppSetting'
import { Word } from '../models/Word'
import { Practice } from './Practice'

const word1 = new Word(1, 1, 'definition 1', 'answer 1')
const word2 = new Word(1, 2, 'definition 2', 'answer 2')

vi.mock('../hooks/useWords', () => ({
  useWords: (numOfWords: number) => {
    return {
      noDeckSelected: true,
      words: [word1, word2],
    }
  },
}))

describe('Practice', () => {
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

    const { container } = render(
      <MemoryRouter>
        <Practice />
      </MemoryRouter>
    )

    await waitFor(async () => {
      const progress = screen.getByRole('progressbar')
      expect(progress).toHaveAttribute('value', '0')
      expect(progress).toHaveAttribute('max', '2')
      expect(screen.getByText('definition 1')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).not.toBeDisabled()
      expect(screen.getByText('Skip')).toBeInTheDocument()
      expect(screen.queryByText('Next')).not.toBeInTheDocument()
    })

    // skip word 1
    const skipButtonElement = screen.getByText('Skip')
    fireEvent.click(skipButtonElement)
    await waitFor(async () => {
      const progress = screen.getByRole('progressbar')
      expect(progress).toHaveAttribute('value', '0')
      expect(progress).toHaveAttribute('max', '2')
      expect(screen.getByText('answer 1')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeDisabled()
      expect(screen.queryByText('Skip')).not.toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
      expect(word1.correctCnt).toBe(0)
      expect(word1.skippedCnt).toBe(1)
    })

    // click next button
    const nextButtonElement = screen.getByText('Next')
    fireEvent.click(nextButtonElement)
    await waitFor(async () => {
      const progress = screen.getByRole('progressbar')
      expect(progress).toHaveAttribute('value', '0')
      expect(progress).toHaveAttribute('max', '2')
      expect(screen.getByText('definition 2')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).not.toBeDisabled()
      expect(screen.getByText('Skip')).toBeInTheDocument()
      expect(screen.queryByText('Next')).not.toBeInTheDocument()
    })

    // answer word 2
    const inputElement = screen.getByRole('textbox')
    fireEvent.change(inputElement, { target: { value: 'answer 2' } })
    await waitFor(async () => {
      const progress = screen.getByRole('progressbar')
      expect(progress).toHaveAttribute('value', '1')
      expect(progress).toHaveAttribute('max', '2')
      expect(screen.getByText('Review')).toBeInTheDocument()
      expect(screen.queryByText('definition 2')).not.toBeInTheDocument()
      expect(screen.getByText('definition 1')).toBeInTheDocument()
      expect(container.querySelector('svg.text-green-500')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).not.toBeDisabled()
      expect(screen.getByText('Skip')).toBeInTheDocument()
      expect(screen.queryByText('Next')).not.toBeInTheDocument()
      expect(word2.correctCnt).toBe(1)
      expect(word2.skippedCnt).toBe(0)
    })

    // answer word 1 (review)
    fireEvent.change(inputElement, { target: { value: 'answer 1' } })
    await waitFor(async () => {
      expect(navigate).toHaveBeenCalledWith('/')
      expect(word1.correctCnt).toBe(1)
      expect(word1.skippedCnt).toBe(1)
    })
  })
})
