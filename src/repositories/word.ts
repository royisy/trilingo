import { db } from '../db'
import { type Word } from '../models/Word'

export class WordRepository {
  async getByDeckId(deckId: number): Promise<Word[]> {
    return await db.words.where('deckId').equals(deckId).toArray()
  }

  async getByCorrectCnt(deckId: number, limit: number): Promise<Word[]> {
    const words = await this.getByDeckId(deckId)
    return words
      .filter((word) => word.correctCnt > 0)
      .sort((a, b) => a.correctCnt - b.correctCnt)
      .slice(0, limit)
  }

  async getBySkippedCnt(deckId: number, limit: number): Promise<Word[]> {
    const words = await this.getByDeckId(deckId)
    return words
      .filter((word) => word.correctCnt === 0)
      .sort((a, b) => a.skippedCnt - b.skippedCnt)
      .slice(0, limit)
  }
}
