import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Word } from "../models/Word";
import { AppSettingRepository } from "../repositories/AppSettingRepository";
import { DeckRepository } from "../repositories/DeckRepository";
import { WordRepository } from "../repositories/WordRepository";

export function Practice() {
    const NUM_OF_WORDS = 10;
    const [words, setWords] = useState<Word[]>([]);
    const [index, setIndex] = useState<number>(0);

    async function getWords() {
        const appSettingRepo = new AppSettingRepository();
        const appSetting = await appSettingRepo.get();
        const deckId = appSetting.selectedDeckId;
        if (!deckId) {
            throw new Error("Incorrect transition.");
        }
        const deckRepo = new DeckRepository();
        const deck = await deckRepo.getById(deckId);
        if (!deck) {
            throw new Error("Deck not found.");
        }
        const wordRepo = new WordRepository();
        let words = await wordRepo.getByIncorrectCnt(deckId, NUM_OF_WORDS);
        if (words.length < NUM_OF_WORDS) {
            const wordsByCorrectCnt = await wordRepo.getByCorrectCnt(deckId, NUM_OF_WORDS - words.length);
            words = words.concat(wordsByCorrectCnt);
        }
        if (words.length === 0) {
            throw new Error("No words.");
        }
        words = words.sort(() => Math.random() - 0.5);
        setWords(words);
    }

    useEffect(() => {
        if (words.length === 0) {
            getWords();
        }
    }, []);

    return (
        <>
            <p><Link to="/">Quit</Link></p>
            <p>{index + 1} / {NUM_OF_WORDS}</p>
            <p>{words[index]?.definition}</p>
            <p><input type="text" /></p>
            <p><button>Skip</button></p>
        </>
    );
}
