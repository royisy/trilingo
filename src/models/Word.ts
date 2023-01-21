import { db } from "../db";

export class Word {
    id?: number;
    deckId: number;
    no: number;
    definition: string;
    answer: string;
    correctCnt: number;
    incorrectCnt: number;

    constructor(deckId: number, no: number, definition: string, answer: string) {
        this.deckId = deckId;
        this.no = no;
        this.definition = definition;
        this.answer = answer;
        this.correctCnt = 0;
        this.incorrectCnt = 0;
    }
}

db.words.mapToClass(Word);
