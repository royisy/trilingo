import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";
import { Deck } from "../models/Deck";
import { AppSettingRepository } from "../repositories/AppSettingRepository";
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
        const deckRepo = new DeckRepository();
        const dbDeck = await deckRepo.getById(deck.id);
        if (!dbDeck) {
            return;
        }
        dbDeck.delete();
        const appSettingRepo = new AppSettingRepository();
        const appSetting = await appSettingRepo.get();
        appSetting.selectedDeckId = null;
        appSetting.save();
    }

    return (
        <li onClick={deleteDeck}>{deck.title}</li>
    );
}
