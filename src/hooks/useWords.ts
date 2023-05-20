import { useEffect, useState } from 'react'
import { type Deck } from '../models/Deck'
import { type Word } from '../models/Word'
import { getAppSetting } from '../repositories/appSetting'
import { getDeckById } from '../repositories/deck'
import { limitWords, shuffleArray } from '../utils/wordUtils'

export const useWords = (
  numOfWords: number
): { noDeckSelected: boolean; words: Word[] } => {
  const [noDeckSelected, setNoDeckSelected] = useState<boolean>(false)
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null)
  const [words, setWords] = useState<Word[]>([])

  useEffect(() => {
    const getSelectedDeck = async (): Promise<void> => {
      const appSetting = await getAppSetting()
      const deckId = appSetting.selectedDeckId
      if (deckId == null) {
        setNoDeckSelected(true)
      } else {
        setNoDeckSelected(false)
        const deck = await getDeckById(deckId)
        if (deck == null) {
          throw new Error('Deck not found.')
        }
        setSelectedDeck(deck)
      }
    }
    void getSelectedDeck()
  }, [])

  useEffect(() => {
    const getWords = async (): Promise<void> => {
      if (selectedDeck == null) {
        return
      }
      const unansweredWords = limitWords(
        await selectedDeck.getUnansweredWords(),
        numOfWords,
        'skippedCnt'
      )
      const wordsNeeded = numOfWords - unansweredWords.length
      const answeredWords =
        wordsNeeded > 0
          ? limitWords(
              await selectedDeck.getAnsweredWords(),
              wordsNeeded,
              'correctCnt'
            )
          : []
      const mergedWords = unansweredWords.concat(answeredWords)
      if (mergedWords.length === 0) {
        throw new Error('No words.')
      }
      const shuffledWords = shuffleArray(mergedWords)
      setWords(shuffledWords)
    }
    void getWords()
  }, [selectedDeck, numOfWords])

  return { noDeckSelected, words }
}
