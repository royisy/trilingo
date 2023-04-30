import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { useDeleteDeck } from '../hooks/useDeleteDeck'
import { type Deck } from '../models/Deck'
import { getAllDecks } from '../repositories/deck'

export const DeleteDeck = (): JSX.Element => {
  const navigate = useNavigate()
  const decks = useLiveQuery(getAllDecks)

  return (
    <>
      <h1>Delete deck</h1>
      <div>
        <button
          className="btn-square btn"
          onClick={() => {
            navigate('/menu')
          }}
        >
          <XMarkIcon />
        </button>
      </div>
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

  return (
    <li>
      {deck.title}
      <XCircleIcon className="h-6 w-6" onClick={handleClick} />
    </li>
  )
}
