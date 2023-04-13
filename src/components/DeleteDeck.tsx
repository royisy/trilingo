import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { useDeleteDeck } from '../hooks/useDeleteDeck'
import { type Deck } from '../models/Deck'
import { getAllDecks } from '../repositories/deck'

export const DeleteDeck = (): JSX.Element => {
  const decks = useLiveQuery(getAllDecks)

  return (
    <>
      <h1>Delete deck</h1>
      <p>
        <Link to="/menu">Menu</Link>
      </p>
      <ul>
        {decks?.map((deck) => (
          <DeckItem key={deck.id} deck={deck} />
        ))}
      </ul>
    </>
  )
}

interface DeckItemProps {
  deck: Deck
}

const DeckItem = ({ deck }: DeckItemProps): JSX.Element => {
  const deleteDeck = useDeleteDeck()

  const handleClick = async (): Promise<void> => {
    await deleteDeck(deck)
  }

  return <li onClick={handleClick}>{deck.title}</li>
}
