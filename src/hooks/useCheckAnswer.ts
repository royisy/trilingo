import { useCallback } from 'react'
import { type Word } from '../models/Word'
import { normalizeString } from '../utils/stringUtils'

export const useCheckAnswer = (): ((
  word: Word,
  input: string
) => Promise<boolean>) => {
  const checkAnswer = useCallback(
    async (word: Word, userAnswer: string): Promise<boolean> => {
      if (normalizeString(userAnswer) !== normalizeString(word.answer)) {
        return false
      }
      word.correctCnt++
      await word.save()
      return true
    },
    []
  )

  return checkAnswer
}
