import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { type Word } from '../models/Word'
import { getAppSetting } from '../repositories/appSetting'
import { getDeckById } from '../repositories/deck'
import { getWordsByDeckId } from '../repositories/word'

export function Home(): JSX.Element {
  const appSetting = useLiveQuery(getAppSetting)
  const deckId = appSetting?.selectedDeckId
  const [title, setTitle] = useState('Trilingo')
  const [words, setWords] = useState<Word[]>([])

  async function getDeck(): Promise<any> {
    if (deckId == null) {
      return
    }
    const deck = await getDeckById(deckId)
    if (deck == null) {
      throw new Error('Incorrect deck id.')
    }
    const words = await getWordsByDeckId(deckId)
    setTitle(deck.title)
    setWords(words)
  }

  useEffect(() => {
    void getDeck()
  }, [deckId])

  return (
    <>
      <h1>{title}</h1>
      <p>
        <Link to="menu">Menu</Link>
      </p>
      <p>
        <Link to="practice">Start</Link>
      </p>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Definition</th>
            <th>Correct</th>
            <th>Skipped</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word) => (
            <tr key={word.no}>
              <td>{word.no}</td>
              <td>{word.definition}</td>
              <td>{word.correctCnt}</td>
              <td>{word.skippedCnt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
