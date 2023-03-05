import { db } from '../db'
import { type Word } from './Word'

export class Deck {
  id: number
  title: string

  constructor(id: number, title: string) {
    this.id = id
    this.title = title
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
}

db.decks.mapToClass(Deck)
