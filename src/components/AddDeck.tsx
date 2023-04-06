import { Link, useNavigate } from 'react-router-dom'
import { useDeckList } from '../hooks/useDeckList'
import { type CsvDeck } from '../models/CsvDeck'
import { type CsvWord } from '../models/CsvWord'
import { Deck } from '../models/Deck'
import { Word } from '../models/Word'
import { getDeckById } from '../repositories/deck'
import { getCsv } from '../utils/csvUtils'

export const AddDeck = (): JSX.Element => {
  const deckList = useDeckList()

  return (
    <>
      <h1>Add deck</h1>
      <p>
        <Link to="/menu">Menu</Link>
      </p>
      <ul>
        {deckList.map((csvDeck) => (
          <DeckItem key={csvDeck.id} csvDeck={csvDeck} />
        ))}
      </ul>
    </>
  )
}

const DeckItem = ({ csvDeck }: { csvDeck: CsvDeck }): JSX.Element => {
  const navigate = useNavigate()

  const addDeck = async (): Promise<void> => {
    const deck = await getDeckById(csvDeck.id)
    if (deck != null) {
      return
    }

    const csvWords = await getCsv<CsvWord>(`/decks/${csvDeck.id}.csv`)
    const words = csvWords.map(
      (csvWord) =>
        new Word(csvDeck.id, csvWord.no, csvWord.definition, csvWord.answer)
    )
    const newDeck = new Deck(csvDeck.id, csvDeck.title)
    await newDeck.save(words)
    navigate('/menu')
  }

  return <li onClick={addDeck}>{csvDeck.title}</li>
}
