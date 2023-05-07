import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useLiveQuery } from 'dexie-react-hooks'
import { useDeleteDeck } from '../hooks/useDeleteDeck'
import { type Deck } from '../models/Deck'
import { getAllDecks } from '../repositories/deck'
import { Header } from './Header'
import { type MenuComponentKey } from './Menu'

interface DeleteDeckProps {
  setMenuComponent: (key: MenuComponentKey) => void
}

export const DeleteDeck = ({
  setMenuComponent,
}: DeleteDeckProps): JSX.Element => {
  const decks = useLiveQuery(getAllDecks)

  return (
    <>
      <Header
        setMenuComponent={setMenuComponent}
        icon={<XMarkIcon className="w-10 sm:w-12" />}
        title="Delete decks"
      />
      <ul className="mt-5 w-80 sm:w-96">
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
    <li className="flex p-3 text-xl">
      <button className="mr-3">
        <XCircleIcon className="h-6 w-6" onClick={handleClick} />
      </button>
      {deck.title}
    </li>
  )
}
