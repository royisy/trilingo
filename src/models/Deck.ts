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
   * Retrieves all unanswered words for the current deck.
   *
   * @returns
   */
  async getUnansweredWords(): Promise<Word[]> {
    return await db.words
      .where('deckId')
      .equals(this.id)
      .and((word) => word.correctCnt === 0)
      .toArray()
  }

  /**
   * Retrieves all answered words for the current deck.
   *
   * @returns
   */
  async getAnsweredWords(): Promise<Word[]> {
    return await db.words
      .where('deckId')
      .equals(this.id)
      .and((word) => word.correctCnt > 0)
      .toArray()
  }
}

db.decks.mapToClass(Deck)
