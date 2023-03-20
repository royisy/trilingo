import { db } from '../db'
import { type Word } from '../models/Word'

export const getWordsByDeckId = async (deckId: number): Promise<Word[]> => {
  return await db.words.where('deckId').equals(deckId).toArray()
}

/**
 * Retrieves words that have been answered correctly at least once
 * and sorts them in ascending order based on their correct count.
 *
 * @param deckId
 * @param limit
 * @returns
 */
export const getWordsByCorrectCnt = async (
  deckId: number,
  limit: number
): Promise<Word[]> => {
  const words = await getWordsByDeckId(deckId)
  return words
    .filter((word) => word.correctCnt > 0)
    .sort((a, b) => a.correctCnt - b.correctCnt)
    .slice(0, limit)
}

/**
 * Retrieves words that have never been answered correctly
 * and sorts them in ascending order based on their skipped count.
 *
 * @param deckId
 * @param limit
 * @returns
 */
export const getWordsBySkippedCnt = async (
  deckId: number,
  limit: number
): Promise<Word[]> => {
  const words = await getWordsByDeckId(deckId)
  return words
    .filter((word) => word.correctCnt === 0)
    .sort((a, b) => a.skippedCnt - b.skippedCnt)
    .slice(0, limit)
}
