import { TrashIcon } from '@heroicons/react/24/solid'
import { useLiveQuery } from 'dexie-react-hooks'
import { useContext } from 'react'
import { CircleFlag } from 'react-circle-flags'
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
    <li className="flex items-center justify-between p-3">
      <div className="flex items-center text-xl">
        <span className="ml-1 mr-2 h-5 w-5">
          <CircleFlag countryCode={deck.language} />
        </span>
        {deck.title}
      </div>
      <label
        htmlFor="delete-deck-modal"
        className="btn-ghost btn-square btn h-7 min-h-0 w-7"
        onClick={() => {
          handleDeckSelect(deck)
        }}
        title="Delete"
      >
        <TrashIcon className="w-5" />
      </label>
    </li>
  )
}
