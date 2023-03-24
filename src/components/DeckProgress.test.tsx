import { render, screen } from '@testing-library/react'
import { Word } from '../models/Word'
import { DeckProgress } from './DeckProgress'

describe('DeckProgress', () => {
  it('should list words', () => {
    const word1 = new Word(1, 1, 'definition 1', 'answer 1')
    const word2 = new Word(1, 2, 'definition 2', 'answer 2')
    const words = [word1, word2]
    render(<DeckProgress words={words} />)
    expect(screen.getByText('No')).toBeInTheDocument()
    expect(screen.getByText('Definition')).toBeInTheDocument()
    expect(screen.getByText('Answer')).toBeInTheDocument()
    expect(screen.getByText('Correct')).toBeInTheDocument()
    expect(screen.getByText('Skipped')).toBeInTheDocument()
    expect(screen.getByText('answer 1')).toBeInTheDocument()
    expect(screen.getByText('definition 2')).toBeInTheDocument()
    expect(screen.getByText('answer 2')).toBeInTheDocument()
  })
})
