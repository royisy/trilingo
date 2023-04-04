import { useEffect, useState } from 'react'
import { type Word } from '../models/Word'
import { getAppSetting } from '../repositories/appSetting'
import { getDeckById } from '../repositories/deck'

export const useWords = (
  numOfWords: number,
  onDeckIdMissing: () => void
): Word[] => {
  const [words, setWords] = useState<Word[]>([])

  useEffect(() => {
    const getWords = async (): Promise<void> => {
      const appSetting = await getAppSetting()
      const deckId = appSetting.selectedDeckId
      if (deckId == null) {
        onDeckIdMissing()
        return
      }
      const deck = await getDeckById(deckId)
      if (deck == null) {
        throw new Error('Deck not found.')
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
  }, [])

  return words
}
