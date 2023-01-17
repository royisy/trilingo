import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Deck } from "../models/Deck";
import { AppSettingRepository } from "../repositories/AppSettingRepository";
import { DeckRepository } from "../repositories/DeckRepository";

export function Practice() {
    const [title, setTitle] = useState<string>();

    async function getDeck() {
        const appSettingRepo = new AppSettingRepository();
        const appSetting = await appSettingRepo.get();
        const deckId = appSetting.selectedDeckId;
        if (!deckId) {
            throw new Error("Incorrect transition.");
        }
        const deckRepo = new DeckRepository();
        const deck = await deckRepo.getById(deckId);
        setTitle(deck?.title);
    }

    useEffect(() => {
        getDeck();
    }, []);

    return (
        <>
            <h1>{title}</h1>
            <p><Link to="/">Quit</Link></p>
        </>
    );
}
