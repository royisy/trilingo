import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Word } from "../models/Word";
import { AppSettingRepository } from "../repositories/AppSettingRepository";
import { DeckRepository } from "../repositories/DeckRepository";
import { WordRepository } from "../repositories/WordRepository";

export function Practice() {
    const NUM_OF_WORDS = 10;
    const TIME_TO_SHOW_CORRECT = 1000;
    const [words, setWords] = useState<Word[]>([]);
    const [index, setIndex] = useState<number>(0);
    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate();

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
        let words = await wordRepo.getBySkippedCnt(deckId, NUM_OF_WORDS);
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

    function checkAnswer(event: any) {
        const word = words[index];
        const userAnswer = event.target.value;
        if (word.answer !== userAnswer) {
            return;
        }
        word.correctCnt++;
        word.save();
        setMessage("Correct!");
        setTimeout(() => setMessage(""), TIME_TO_SHOW_CORRECT);
        event.target.value = "";
        nextWord();
    }

    function skip() {
        const word = words[index];
        word.skippedCnt++;
        word.save();
        nextWord();
    }

    function nextWord() {
        const nextIndex = index + 1;
        if (nextIndex >= NUM_OF_WORDS) {
            navigate("/");
        }
        setIndex(nextIndex);
    }

    useEffect(() => {
        if (words.length === 0) {
            getWords();
        }
    }, []);

    const elements = <>
        <p>{index + 1} / {NUM_OF_WORDS}</p>
        <p>{words[index]?.definition}</p>
        <p>{message}</p>
        <p><input type="text" onChange={checkAnswer} /></p>
        <p><button onClick={skip}>Skip</button></p>
    </>
    return (
        <>
            <p><Link to="/">Quit</Link></p>
            {words.length > 0 && elements}
        </>
    );
}
