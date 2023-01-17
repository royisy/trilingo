import { useLiveQuery } from "dexie-react-hooks";
import { Link, useNavigate } from "react-router-dom";
import { Deck } from "../models/Deck";
import { AppSettingRepository } from "../repositories/AppSettingRepository";
import { DeckRepository } from "../repositories/DeckRepository";

export function Menu() {
    const repo = new DeckRepository();
    const decks = useLiveQuery(repo.getAll);

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

function DeckItem({ deck }: { deck: Deck }) {
    const navigate = useNavigate();

    async function selectDeck() {
        const repo = new AppSettingRepository();
        const appSetting = await repo.get();
        appSetting.selectedDeckId = deck.id;
        appSetting.save();
        navigate("/");
    }

    return (
        <li onClick={selectDeck}>{deck.title}</li>
    );
}
