import { db, IDeck } from "../db";

export class Deck implements IDeck {
    id: number;
    title: string;

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
    }

    save() {
        db.decks.add(new Deck(this.id, this.title));
    }
}

db.decks.mapToClass(Deck);
