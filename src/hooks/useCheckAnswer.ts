import { useCallback } from 'react'
import { type Word } from '../models/Word'
import { normalizeString } from '../utils/stringUtils'

export const useCheckAnswer = (): ((
  word: Word,
  input: string,
  isReview: boolean
) => Promise<boolean>) => {
  const checkAnswer = useCallback(
    async (
      word: Word,
      userAnswer: string,
      isReview: boolean
    ): Promise<boolean> => {
      if (normalizeString(userAnswer) !== normalizeString(word.answer)) {
        return false
      }
      if (!isReview) {
        word.correctCnt++
        await word.save()
      }
      return true
    },
    []
  )

  return checkAnswer
}
