import { type Word } from '../models/Word'

export const useStats = (
  words: Word[]
): { memorizedWords: number; remainingWords: number; progress: string } => {
  const memorizedWords = words.filter((word) => word.correctCnt > 0).length
  const remainingWords = words.length - memorizedWords
  const progress = ((memorizedWords / words.length) * 100).toFixed(1)
  return { memorizedWords, remainingWords, progress }
}
