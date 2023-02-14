import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Deck } from '../models/Deck'
import { Word } from '../models/Word'
import { getAllDecks, getDeckById } from '../repositories/deck'
import { getCsv } from '../utils/csvUtils'

export function AddDeck(): JSX.Element {
  const [deckList, setDeckList] = useState<
    Array<{ id: number; title: string }>
  >([])

  useEffect(() => {
    void getCsv<{ id: number; title: string }>('/deck-list.csv').then((csv) => {
      setDeckList(csv)
    })
  }, [])

  const dbDecks = useLiveQuery(getAllDecks)
  const dbDeckIds = dbDecks?.map((deck) => deck.id)
  const deckListToAdd = deckList.filter(
    (row) => dbDeckIds?.includes(row.id) === false
  )

  return (
    <>
      <h1>Add deck</h1>
      <p>
        <Link to="/menu">Menu</Link>
      </p>
      <ul>
        {deckListToAdd.map((deck) => (
          <DeckItem key={deck.id} deck={deck} />
        ))}
      </ul>
    </>
  )
}

function DeckItem({
  deck,
}: {
  deck: { id: number; title: string }
}): JSX.Element {
  const navigate = useNavigate()

  async function addDeck(): Promise<void> {
    try {
      const dbDeck = await getDeckById(deck.id)
      if (dbDeck != null) {
        return
      }

      const wordsCsv = await getCsv<{
        no: number
        definition: string
        answer: string
      }>(`/decks/${deck.id}.csv`)
      const words = wordsCsv.map(
        (row) => new Word(deck.id, row.no, row.definition, row.answer)
      )
      const newDeck = new Deck(deck.id, deck.title)
      newDeck.save(words)
      navigate('/menu')
    } catch (error) {}
  }

  return <li onClick={addDeck}>{deck.title}</li>
}
