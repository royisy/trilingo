import { useEffect, useState } from 'react'
import { type Deck } from '../models/Deck'
import { type Word } from '../models/Word'

export const useWords = (deck: Deck | null, numOfWords: number): Word[] => {
  const [words, setWords] = useState<Word[]>([])

  useEffect(() => {
    const getWords = async (): Promise<void> => {
      if (deck == null) {
        return
      }
      let words = await deck.getWordsBySkippedCnt(numOfWords)
      if (words.length < numOfWords) {
        const wordsByCorrectCnt = await deck.getWordsByCorrectCnt(
          numOfWords - words.length
        )
        words = words.concat(wordsByCorrectCnt)
      }
      if (words.length === 0) {
        throw new Error('No words.')
      }
      words = words.sort(() => Math.random() - 0.5)
      setWords(words)
    }
    void getWords()
  }, [deck, numOfWords])

  return words
}
