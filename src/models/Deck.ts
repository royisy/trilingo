import { db } from '../db'
import { type Word } from './Word'

export class Deck {
  id: number
  title: string
  private _words: Promise<Word[]> | undefined

  constructor(id: number, title: string) {
    this.id = id
    this.title = title
  }

  get words(): Promise<Word[]> {
    if (this._words == null) {
      this._words = db.words.where('deckId').equals(this.id).toArray()
    }
    return this._words
  }

  async save(words: Word[]): Promise<void> {
    await db.transaction('rw', db.decks, db.words, async () => {
      await db.words.bulkAdd(words)
      await db.decks.add(new Deck(this.id, this.title))
    })
  }

  async delete(): Promise<void> {
    await db.transaction('rw', db.decks, db.words, async () => {
      await db.decks.where('id').equals(this.id).delete()
      await db.words.where('deckId').equals(this.id).delete()
    })
  }

  /**
   * Retrieves words that have been answered correctly at least once
   * and sorts them in ascending order based on their correct count.
   *
   * @param limit
   * @returns
   */
  async getWordsByCorrectCnt(limit: number): Promise<Word[]> {
    const words = await this.words
    return words
      .filter((word) => word.correctCnt > 0)
      .sort((a, b) => a.correctCnt - b.correctCnt)
      .slice(0, limit)
  }

  /**
   * Retrieves words that have never been answered correctly
   * and sorts them in ascending order based on their skipped count.
   *
   * @param limit
   * @returns
   */
  async getWordsBySkippedCnt(limit: number): Promise<Word[]> {
    const words = await this.words
    return words
      .filter((word) => word.correctCnt === 0)
      .sort((a, b) => a.skippedCnt - b.skippedCnt)
      .slice(0, limit)
  }
}

db.decks.mapToClass(Deck)
