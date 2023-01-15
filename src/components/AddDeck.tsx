import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../db";
import { Deck } from "../models/Deck";
import { Word } from "../models/Word";
import { getCsv } from "../utils/csv-util";

export function AddDeck() {
    const [deckList, setDeckList] = useState<{ id: number, title: string }[]>([]);
    useEffect(() => {
        getCsv<{ id: number, title: string }>("/deck-list.csv")
            .then(csv => setDeckList(csv));
    }, []);
    const dbDecks = useLiveQuery(
        () => db.decks.toArray()
    );
    const dbDeckIds = dbDecks?.map(deck => deck.id);
    const deckListToAdd = deckList.filter(row => !dbDeckIds?.includes(row.id));

    return (
        <>
            <h1>Add deck</h1>
            <p><Link to="/menu">Menu</Link></p>
            <ul>
                {deckListToAdd.map(deck => <DeckItem key={deck.id} deck={deck} />)}
            </ul>
        </ >
    );
}

function DeckItem({ deck }: { deck: { id: number, title: string } }) {
    const navigate = useNavigate();

    async function addDeck() {
        const dbDeck = await db.decks.get(deck.id);
        if (dbDeck) {
            return;
        }

        const wordsCsv = await getCsv<{
            no: number,
            definition: string,
            answer: string
        }>(`/decks/${deck.id}.csv`);
        const words = wordsCsv.map(row => new Word(deck.id, row.no, row.definition, row.answer));
        const newDeck = new Deck(deck.id, deck.title);
        newDeck.save(words);
        navigate("/menu");
    }

    return (
        <li onClick={addDeck}>{deck.title}</li>
    );
}
