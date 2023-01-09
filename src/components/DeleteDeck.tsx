import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";
import { db } from "../db";
import { Deck } from "../models/Deck";

export function DeleteDeck() {
    const decks = useLiveQuery(
        () => db.decks.toArray()
    );

    return (
        <>
            <h1>Delete deck</h1>
            <p><Link to="/menu">Menu</Link></p>
            <ul>
                {decks?.map(deck => <DeckItem key={deck.id} deck={deck} />)}
            </ul>
        </ >
    );
}

function DeckItem({ deck }: { deck: Deck }) {
    async function deleteDeck() {
        const dbDeck = await db.decks.get(deck.id);
        if (!dbDeck) {
            return;
        }
        dbDeck.delete();
    }

    return (
        <li onClick={deleteDeck}>{deck.title}</li>
    );
}
