import Dexie, { Table } from "dexie";
import { IDeck } from "./models/Deck";
import { IWord } from "./models/Word";

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
