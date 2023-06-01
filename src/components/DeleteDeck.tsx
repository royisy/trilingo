import { TrashIcon } from '@heroicons/react/24/solid'
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
      <ul className="p-2">
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
        className="btn-ghost btn-square btn mr-3 h-7 min-h-0 w-7"
        onClick={() => {
          handleDeckSelect(deck)
        }}
        title="Delete"
      >
        <TrashIcon className="w-5" />
      </label>
      {deck.title}
    </li>
  )
}
