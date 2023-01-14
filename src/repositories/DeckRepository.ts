import { db } from "../db";

export class DeckRepository {
    async get(deckId: number) {
        return await db.decks.get(deckId);
    }
}
