import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";
import { Deck } from "../models/Deck";
import { DeckRepository } from "../repositories/DeckRepository";

export function DeleteDeck() {
    const repo = new DeckRepository();
    const decks = useLiveQuery(repo.getAll);

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
        const repo = new DeckRepository();
        const dbDeck = await repo.getById(deck.id);
        if (!dbDeck) {
            return;
        }
        dbDeck.delete();
    }

    return (
        <li onClick={deleteDeck}>{deck.title}</li>
    );
}
