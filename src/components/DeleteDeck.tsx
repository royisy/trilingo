import { XCircleIcon } from '@heroicons/react/24/solid'
import { useLiveQuery } from 'dexie-react-hooks'
import { useContext } from 'react'
import { MenuContext } from '../contexts/MenuContext'
import { type Deck } from '../models/Deck'
import { getAllDecks } from '../repositories/deck'
import { MenuHeader } from './MenuHeader'

export const DeleteDeck = (): JSX.Element => {
  const decks = useLiveQuery(getAllDecks)

  return (
    <>
      <MenuHeader title="Delete Deck" />
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
  const { setDeckToDelete } = useContext(MenuContext)

  const handleDeckSelect = (deck: Deck): void => {
    setDeckToDelete(deck)
  }

  return (
    <li className="flex items-center p-3 text-xl">
      <label
        htmlFor="delete-deck-modal"
        className="mr-3"
        onClick={() => {
          handleDeckSelect(deck)
        }}
        title="Delete"
      >
        <XCircleIcon className="w-6" />
      </label>
      {deck.title}
    </li>
  )
}
