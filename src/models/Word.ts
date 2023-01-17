import { db } from "../db";

export class Word {
    id?: number;
    deckId: number;
    no: number;
    definition: string;
    answer: string;

    constructor(deckId: number, no: number, definition: string, answer: string) {
        this.deckId = deckId;
        this.no = no;
        this.definition = definition;
        this.answer = answer;
    }
}

db.words.mapToClass(Word);
