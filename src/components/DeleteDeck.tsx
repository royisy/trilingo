import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";
import { db } from "../db";
import { IDeck } from "../models/Deck";

export default function DeleteDeck() {
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

function DeckItem({ deck }: { deck: IDeck }) {
    async function deleteDeck() {
        console.log(deck.id);
    }

    return (
        <li onClick={deleteDeck}>{deck.title}</li>
    );
}
