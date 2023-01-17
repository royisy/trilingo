import Dexie, { Table } from "dexie";
import type { AppSetting } from "./models/AppSetting";
import type { Deck } from "./models/Deck";
import type { Word } from "./models/Word";

export class TrilingoDatabase extends Dexie {
    appSettings!: Table<AppSetting>;
    decks!: Table<Deck>;
    words!: Table<Word>;

    constructor() {
        super("TrilingoDatabase");
        this.version(1).stores({
            appSettings: "id",
            decks: "id",
            words: "++id, deckId",
        });
    }
}

export const db = new TrilingoDatabase();
