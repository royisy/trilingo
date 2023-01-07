import { db } from "../db";
import { IWord } from "./Word";

export interface IDeck {
    id: number;
    title: string;
}

export class Deck implements IDeck {
    id: number;
    title: string;

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
    }

    save(words: IWord[]) {
        db.transaction("rw", db.decks, db.words, () => {
            db.words.bulkAdd(words);
            db.decks.add(new Deck(this.id, this.title));
        });
    }

    delete() {
        db.transaction("rw", db.decks, db.words, () => {
            db.decks.where("id").equals(this.id).delete();
            db.words.where("deckId").equals(this.id).delete();
        });
    }
}
