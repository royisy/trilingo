import { type Word } from './Word'

export interface WordResult {
  word: Word
  correct: boolean
  skippedCnt: number
}
