import { db } from '../db'
import { type Word } from './Word'

export class Deck {
  id: number
  title: string

  constructor(id: number, title: string) {
    this.id = id
    this.title = title
  }

  save(words: Word[]): void {
    void db.transaction('rw', db.decks, db.words, () => {
      void db.words.bulkAdd(words)
      void db.decks.add(new Deck(this.id, this.title))
    })
  }

  delete(): void {
    void db.transaction('rw', db.decks, db.words, () => {
      void db.decks.where('id').equals(this.id).delete()
      void db.words.where('deckId').equals(this.id).delete()
    })
  }
}

db.decks.mapToClass(Deck)
