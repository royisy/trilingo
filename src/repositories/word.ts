import { db } from '../db'
import { type Word } from '../models/Word'

export async function getWordsByDeckId(deckId: number): Promise<Word[]> {
  return await db.words.where('deckId').equals(deckId).toArray()
}

export async function getWordsByCorrectCnt(
  deckId: number,
  limit: number
): Promise<Word[]> {
  const words = await getWordsByDeckId(deckId)
  return words
    .filter((word) => word.correctCnt > 0)
    .sort((a, b) => a.correctCnt - b.correctCnt)
    .slice(0, limit)
}

export async function getWordsBySkippedCnt(
  deckId: number,
  limit: number
): Promise<Word[]> {
  const words = await getWordsByDeckId(deckId)
  return words
    .filter((word) => word.correctCnt === 0)
    .sort((a, b) => a.skippedCnt - b.skippedCnt)
    .slice(0, limit)
}
