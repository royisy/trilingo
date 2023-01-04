import { parse } from "papaparse";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../db";
import { Deck } from "../models/Deck";

export default function AddDeck() {
    const [deckList, setDeckList] = useState<{ id: number, title: string }[]>([]);
    useEffect(() => {
        fetch("/deck-list.csv")
            .then(res => res.text())
            .then(csv => {
                parse(csv, {
                    header: true,
                    complete: (result: any) => setDeckList(result.data),
                    skipEmptyLines: true
                });
            });
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
        const newDeck = new Deck(deck.id, deck.title);
        newDeck.save();
    }

    return (
        <li onClick={addDeck}>{deck.title}</li>
    );
}
