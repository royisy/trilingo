import { useLiveQuery } from 'dexie-react-hooks'
import { Link, useNavigate } from 'react-router-dom'
import { useSelectDeck } from '../hooks/useSelectDeck'
import { type Deck } from '../models/Deck'
import { getAllDecks } from '../repositories/deck'

export const Menu = (): JSX.Element => {
  const decks = useLiveQuery(getAllDecks)

  return (
    <>
      <h1>Menu</h1>
      <p>
        <Link to="/">Home</Link>
      </p>
      <ul>
        {decks?.map((deck) => (
          <DeckItem key={deck.id} deck={deck} />
        ))}
      </ul>
      <p>
        <Link to="add-deck">Add deck</Link>
      </p>
      <p>
        <Link to="delete-deck">Delete deck</Link>
      </p>
    </>
  )
}

const DeckItem = ({ deck }: { deck: Deck }): JSX.Element => {
  const selectDeck = useSelectDeck()
  const navigate = useNavigate()

  const handleClick = async (): Promise<void> => {
    await selectDeck(deck)
    navigate('/')
  }

  return <li onClick={handleClick}>{deck.title}</li>
}
