import { render } from '@testing-library/react'
import { Word } from '../models/Word'
import { DeckProgress } from './DeckProgress'

describe('DeckProgress', () => {
  it('should list words', () => {
    const word1 = new Word(1, 1, 'pos 1', 'definition 1', 'answer 1')
    const word2 = new Word(1, 2, 'pos 2', 'definition 2', 'answer 2')
    const words = [word1, word2]
    render(<DeckProgress words={words} />)
    const liElement1 = document.querySelector(
      '[data-definition="definition 1"]'
    )
    expect(liElement1).toBeInTheDocument()
    const liElement2 = document.querySelector(
      '[data-definition="definition 2"]'
    )
    expect(liElement2).toBeInTheDocument()
  })
})
