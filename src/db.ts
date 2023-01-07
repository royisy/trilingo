import Dexie, { Table } from "dexie";
import { Deck, IDeck } from "./models/Deck";
import { IWord, Word } from "./models/Word";

export class TrilingoDatabase extends Dexie {
    decks!: Table<IDeck>;
    words!: Table<IWord>;

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
