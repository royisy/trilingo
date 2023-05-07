import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { useLiveQuery } from 'dexie-react-hooks'
import { useSelectDeck } from '../hooks/useSelectDeck'
import { useSelectedDeck } from '../hooks/useSelectedDeck'
import { type Deck } from '../models/Deck'
import { getAllDecks } from '../repositories/deck'
import { DeckList } from './DeckList'
import { type MenuComponentKey } from './Menu'

interface SelectDeckProps {
  setMenuComponent: (key: MenuComponentKey) => void
}

export const SelectDeck = ({
  setMenuComponent,
}: SelectDeckProps): JSX.Element => {
  const decks = useLiveQuery(getAllDecks)
  const { selectedDeck } = useSelectedDeck()

  return (
    <>
      <DeckList>
        <>
          {decks?.map((deck) => (
            <DeckItem
              key={deck.id}
              deck={deck}
              isSelected={deck.id === selectedDeck?.id}
            />
          ))}
        </>
      </DeckList>
      <div className="mt-6">
        <button
          className="btn-outline btn-square btn-sm btn ml-3"
          onClick={() => {
            setMenuComponent('add-deck')
          }}
        >
          <PlusIcon className="w-8" />
        </button>
        <button
          className="btn-outline btn-square btn-sm btn ml-4"
          onClick={() => {
            setMenuComponent('delete-deck')
          }}
        >
          <MinusIcon className="w-8" />
        </button>
      </div>
    </>
  )
}

interface DeckItemProps {
  deck: Deck
  isSelected: boolean
}

const DeckItem = ({ deck, isSelected }: DeckItemProps): JSX.Element => {
  const selectDeck = useSelectDeck()

  const handleClick = async (): Promise<void> => {
    await selectDeck(deck)
  }

  return (
    <li className={isSelected ? 'bordered' : ''}>
      <button className="text-xl" onClick={handleClick}>
        {deck.title}
      </button>
    </li>
  )
}
