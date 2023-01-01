import { parse } from "papaparse";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AddDeck() {
    const [deckList, setDeckList] = useState<{ id: number, title: string }[]>([]);
    useEffect(() => {
        fetch("/deck-list.csv")
            .then(res => res.text())
            .then(csv => {
                parse(csv, {
                    header: true,
                    complete: (result: any) => setDeckList(result.data),
                    skipEmptyLines: true
                });
            });
    }, []);
    return (
        <>
            <h1>Add deck</h1>
            <p><Link to="/menu">Menu</Link></p>
            <ul>
                {deckList.map(deck => <li>{deck.title}</li>)}
            </ul>
        </ >
    );
}
