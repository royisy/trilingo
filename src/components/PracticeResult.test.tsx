import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Word } from '../models/Word'
import { PracticeResult } from './PracticeResult'

describe('PracticeResult', () => {
  it('should render', () => {
    const word1 = new Word(1, 1, 'pos 1', 'definition 1', 'answer 1')
    word1.id = 1
    const wordResult1 = {
      word: word1,
      correct: false,
      skippedCnt: 1,
    }
    const word2 = new Word(1, 2, 'pos 2', 'definition 2', 'answer 2')
    word2.id = 2
    const wordResult2 = {
      word: word2,
      correct: true,
      skippedCnt: 2,
    }
    render(
      <MemoryRouter>
        <PracticeResult result={[wordResult1, wordResult2]} />
      </MemoryRouter>
    )
    const row1 = screen.getByText('definition 1').closest('tr')
    const lastCell1 = row1?.querySelector('td:last-child')
    expect(lastCell1?.textContent).toBe('+1')
    const row2 = screen.getByText('definition 2').closest('tr')
    const lastCell2 = row2?.querySelector('td:last-child')
    const svgElement = lastCell2?.querySelector('svg')
    expect(svgElement).toBeInTheDocument()
  })
})
