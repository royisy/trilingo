import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { type Word } from '../models/Word'
import { getAppSetting } from '../repositories/appSetting'
import { getDeckById } from '../repositories/deck'
import { getWordsByDeckId } from '../repositories/word'
import { DeckProgress } from './DeckProgress'

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
      {deckId != null && (
        <>
          <p>
            <Link to="practice">Start</Link>
          </p>
          <DeckProgress words={words} />
        </>
      )}
    </>
  )
}
