import { render } from '@testing-library/react'
import { Word } from '../models/Word'
import { DeckProgress } from './DeckProgress'

describe('DeckProgress', () => {
  it('should list words', () => {
    const word1 = new Word(1, 1, 'definition 1', 'answer 1')
    const word2 = new Word(1, 2, 'definition 2', 'answer 2')
    const words = [word1, word2]
    const { container } = render(<DeckProgress words={words} />)
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
