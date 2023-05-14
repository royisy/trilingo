import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { useLiveQuery } from 'dexie-react-hooks'
import { useSelectDeck } from '../hooks/useSelectDeck'
import { type Deck } from '../models/Deck'
import { getAppSetting } from '../repositories/appSetting'
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
  const appSetting = useLiveQuery(getAppSetting)
  const selectedDeckId = appSetting?.selectedDeckId ?? null

  return (
    <>
      <h1 className="m-5 text-3xl font-bold">Trilingo</h1>
      <DeckList>
        <>
          {decks?.map((deck) => (
            <DeckItem
              key={deck.id}
              deck={deck}
              isSelected={deck.id === selectedDeckId}
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
