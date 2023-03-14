import { db } from '../db'
import { type Deck } from '../models/Deck'

export const getAllDecks = async (): Promise<Deck[]> => {
  return await db.decks.toArray()
}

export const getDeckById = async (
  deckId: number
): Promise<Deck | undefined> => {
  return await db.decks.get(deckId)
}
