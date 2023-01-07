import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";
import { db } from "../db";
import { IDeck } from "../models/Deck";

export default function Menu() {
    const decks = useLiveQuery(
        () => db.decks.toArray()
    );

    return (
        <>
            <h1>Menu</h1>
            <p><Link to="/">Home</Link></p>
            <ul>
                {decks?.map(deck => <DeckItem key={deck.id} deck={deck} />)}
            </ul>
            <p><Link to="add-deck">Add deck</Link></p>
            <p><Link to="delete-deck">Delete deck</Link></p>
        </>
    );
}

function DeckItem({ deck }: { deck: IDeck }) {
    async function selectDeck() {
        console.log(deck.id);
    }

    return (
        <li onClick={selectDeck}>{deck.title}</li>
    );
}
