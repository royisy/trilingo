import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Word } from "../models/Word";
import { AppSettingRepository } from "../repositories/AppSettingRepository";
import { DeckRepository } from "../repositories/DeckRepository";
import { WordRepository } from "../repositories/WordRepository";

export function Home() {
    const appSettingRepo = new AppSettingRepository();
    const appSetting = useLiveQuery(appSettingRepo.get);
    const deckId = appSetting?.selectedDeckId;
    const [title, setTitle] = useState("Trilingo");
    const [words, setWords] = useState<Word[]>([]);

    async function getDeck() {
        if (!deckId) {
            return;
        }
        const deckRepo = new DeckRepository();
        const deck = await deckRepo.get(deckId);
        if (!deck) {
            throw new Error("Incorrect deck id.");
        }
        const wordRepo = new WordRepository();
        const words = await wordRepo.getByDeckId(deckId);
        setTitle(deck.title);
        setWords(words);
    }

    useEffect(() => {
        getDeck();
    }, [deckId]);

    return (
        <>
            <h1>{title}</h1>
            <p><Link to="menu">Menu</Link></p>
            <ul>
                {words.map((word) => <li key={word.no}>{word.answer}</li>)}
            </ul>
        </>
    );
}
