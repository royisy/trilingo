import { db } from "../db";

export class DeckRepository {
    async getAll() {
        return await db.decks.toArray();
    }

    async getById(deckId: number) {
        return await db.decks.get(deckId);
    }
}
