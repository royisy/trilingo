import { db } from "../db";

export class Word {
    id?: number;
    deckId: number;
    no: number;
    definition: string;
    answer: string;
    correctCnt: number;
    skippedCnt: number;

    constructor(deckId: number, no: number, definition: string, answer: string) {
        this.deckId = deckId;
        this.no = no;
        this.definition = definition;
        this.answer = answer;
        this.correctCnt = 0;
        this.skippedCnt = 0;
    }

    save() {
        db.words.put(this);
    }
}

db.words.mapToClass(Word);
