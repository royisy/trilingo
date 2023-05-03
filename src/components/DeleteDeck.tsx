import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useLiveQuery } from 'dexie-react-hooks'
import { useDeleteDeck } from '../hooks/useDeleteDeck'
import { type Deck } from '../models/Deck'
import { getAllDecks } from '../repositories/deck'
import { DeckList } from './DeckList'
import { Header } from './Header'

export const DeleteDeck = (): JSX.Element => {
  const decks = useLiveQuery(getAllDecks)

  return (
    <>
      <Header navigatePath="/menu" icon={<XMarkIcon />} title="Delete deck" />
      <DeckList>
        <>
          {decks?.map((deck) => (
            <DeckItem key={deck.id} deck={deck} />
          ))}
        </>
      </DeckList>
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
    <li className="flex">
      <button className="text-left">
        {deck.title}
        <XCircleIcon className="h-6 w-6" onClick={handleClick} />
      </button>
    </li>
  )
}
