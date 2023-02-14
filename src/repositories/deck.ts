import { db } from '../db'
import { type Deck } from '../models/Deck'

export async function getAllDecks(): Promise<Deck[]> {
  return await db.decks.toArray()
}

export async function getDeckById(deckId: number): Promise<Deck | undefined> {
  return await db.decks.get(deckId)
}
