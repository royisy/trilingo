import Dexie, { Table } from "dexie";
import { Deck } from "./models/Deck";
import { Word } from "./models/Word";

export class TrilingoDatabase extends Dexie {
    decks!: Table<Deck>;
    words!: Table<Word>;

    constructor() {
        super("TrilingoDatabase");
        this.version(1).stores({
            decks: "id",
            words: "[deckId+wordNo]"
        });
        this.decks.mapToClass(Deck);
        this.words.mapToClass(Word);
    }
}

export const db = new TrilingoDatabase(); 
