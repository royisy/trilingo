import { db } from "../db";

export interface IWord {
    deck_id: number;
    word_no: number;
    definition: string;
    answer: string;
}

export class Word implements IWord {
    deck_id: number;
    word_no: number;
    definition: string;
    answer: string;

    constructor(deck_id: number, word_no: number, definition: string, answer: string) {
        this.deck_id = deck_id;
        this.word_no = word_no;
        this.definition = definition;
        this.answer = answer;
    }
}

db.decks.mapToClass(Word);
