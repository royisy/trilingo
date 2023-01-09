export class Word {
    deckId: number;
    wordNo: number;
    definition: string;
    answer: string;

    constructor(deckId: number, wordNo: number, definition: string, answer: string) {
        this.deckId = deckId;
        this.wordNo = wordNo;
        this.definition = definition;
        this.answer = answer;
    }
}
