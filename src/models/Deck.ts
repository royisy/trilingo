import { db, IDeck, IWord } from "../db";

export class Deck implements IDeck {
    id: number;
    title: string;

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
    }

    save(words: IWord[]) {
        db.transaction("rw", db.decks, db.words, () => {
            db.decks.add(new Deck(this.id, this.title));
            db.words.bulkAdd(words);
        });
    }
}

db.decks.mapToClass(Deck);
