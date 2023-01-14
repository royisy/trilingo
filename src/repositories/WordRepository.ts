import { db } from "../db";

export class WordRepository {
    async getByDeckId(deckId: number) {
        return await db.words.where("deckId").equals(deckId).toArray();
    }
}
