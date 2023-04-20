import { useEffect, useState } from 'react'
import { type Deck } from '../models/Deck'
import { type Word } from '../models/Word'
import { limitWords, shuffleArray } from '../utils/wordUtils'

export const useWords = (deck: Deck | null, numOfWords: number): Word[] => {
  const [words, setWords] = useState<Word[]>([])

  useEffect(() => {
    const getWords = async (): Promise<void> => {
      if (deck == null) {
        return
      }
      const unansweredWords = limitWords(
        await deck.getUnansweredWords(),
        numOfWords,
        'skippedCnt'
      )
      const wordsNeeded = numOfWords - unansweredWords.length
      const answeredWords =
        wordsNeeded > 0
          ? limitWords(await deck.getAnsweredWords(), wordsNeeded, 'correctCnt')
          : []
      const mergedWords = unansweredWords.concat(answeredWords)
      if (mergedWords.length === 0) {
        throw new Error('No words.')
      }
      const shuffledWords = shuffleArray(mergedWords)
      setWords(shuffledWords)
    }
    void getWords()
  }, [deck, numOfWords])

  return words
}
