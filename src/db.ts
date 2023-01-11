import Dexie, { Table } from "dexie";
import { AppSetting } from "./models/AppSetting";
import { Deck } from "./models/Deck";
import { Word } from "./models/Word";

export class TrilingoDatabase extends Dexie {
    appSettings!: Table<AppSetting>;
    decks!: Table<Deck>;
    words!: Table<Word>;

    constructor() {
        super("TrilingoDatabase");
        this.version(1).stores({
            appSettings: "id",
            decks: "id",
            words: "[deckId+wordNo]",
        });
        this.appSettings.mapToClass(AppSetting);
        this.decks.mapToClass(Deck);
        this.words.mapToClass(Word);
    }
}

export const db = new TrilingoDatabase(); 
