import { db } from "../db";

export class WordRepository {
    async getByDeckId(deckId: number) {
        return await db.words.where("deckId").equals(deckId).toArray();
    }

    async getByCorrectCnt(deckId: number, limit: number) {
        let words = await this.getByDeckId(deckId);
        return words.filter(word => word.correctCnt > 0)
            .sort((a, b) => a.correctCnt - b.correctCnt)
            .slice(0, limit);
    }

    async getBySkippedCnt(deckId: number, limit: number) {
        let words = await this.getByDeckId(deckId);
        return words.filter(word => word.correctCnt === 0)
            .sort((a, b) => a.skippedCnt - b.skippedCnt)
            .slice(0, limit);
    }
}
