import { db } from '../db'
import { type Deck } from '../models/Deck'

export class DeckRepository {
  async getAll(): Promise<Deck[]> {
    return await db.decks.toArray()
  }

  async getById(deckId: number): Promise<Deck | undefined> {
    return await db.decks.get(deckId)
  }
}
