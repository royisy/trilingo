import Dexie, { Table } from "dexie";

export interface IDeck {
    id: number;
    title: string;
}

export interface IWord {
    deck_id: number;
    word_no: number;
    definition: string;
    answer: string;
}

export class TrilingoDatabase extends Dexie {
    decks!: Table<IDeck>;
    words!: Table<IWord>;

    constructor() {
        super("TrilingoDatabase");
        this.version(1).stores({
            decks: "id",
            words: "[deck_id+word_no]"
        });
    }
}

export const db = new TrilingoDatabase(); 
