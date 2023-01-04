import Dexie, { Table } from "dexie";

export interface IDeck {
    id: number;
    title: string;
}

export class TrilingoDatabase extends Dexie {
    decks!: Table<IDeck>;

    constructor() {
        super("TrilingoDatabase");
        this.version(1).stores({
            decks: "id, title"
        });
    }
}

export const db = new TrilingoDatabase(); 
