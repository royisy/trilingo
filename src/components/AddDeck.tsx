import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../db";
import { Deck } from "../models/Deck";
import { Word } from "../models/Word";
import { getCsv } from "../utils/csv-util";

export default function AddDeck() {
    const [deckList, setDeckList] = useState<{ id: number, title: string }[]>([]);
    useEffect(() => {
        getCsv<{ id: number, title: string }>("/deck-list.csv")
            .then(csv => setDeckList(csv));
    }, []);

    return (
        <>
            <h1>Add deck</h1>
            <p><Link to="/menu">Menu</Link></p>
            <ul>
                {deckList.map(deck => <DeckItem key={deck.id} deck={deck} />)}
            </ul>
        </ >
    );
}

function DeckItem({ deck }: { deck: { id: number, title: string } }) {
    async function addDeck() {
        const dbDeck = await db.decks.get(deck.id);
        if (dbDeck) {
            return;
        }

        const wordsCsv = await getCsv<{
            deck_id: number,
            no: number,
            definition: string,
            answer: string
        }>(`/decks/${deck.id}.csv`);
        const words = wordsCsv.map(row => new Word(deck.id, row.no, row.definition, row.answer));
        const newDeck = new Deck(deck.id, deck.title);
        newDeck.save(words);
    }

    return (
        <li onClick={addDeck}>{deck.title}</li>
    );
}
