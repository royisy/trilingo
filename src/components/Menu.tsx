import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { useLiveQuery } from 'dexie-react-hooks'
import { useContext } from 'react'
import { MenuContext } from '../contexts/MenuContext'
import { useSelectDeck } from '../hooks/useSelectDeck'
import { type Deck } from '../models/Deck'
import { getAppSetting } from '../repositories/appSetting'
import { getAllDecks } from '../repositories/deck'
import { DeckList } from './DeckList'
import { Logo } from './Logo'

export const Menu = (): JSX.Element => {
  const decks = useLiveQuery(getAllDecks)
  const appSetting = useLiveQuery(getAppSetting)
  const selectedDeckId = appSetting?.selectedDeckId ?? null
  const { setMenuComponent } = useContext(MenuContext)

  return (
    <>
      <div className="m-5">
        <Logo />
      </div>
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
      <div className="mt-5">
        <button
          className="btn-outline btn-square btn-sm btn ml-4"
          onClick={() => {
            setMenuComponent('add-deck')
          }}
          title="Add Deck"
        >
          <PlusIcon className="w-8" />
        </button>
        <button
          className="btn-outline btn-square btn-sm btn ml-4"
          onClick={() => {
            setMenuComponent('delete-deck')
          }}
          title="Delete Deck"
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
  const { toggleDrawerOpen } = useContext(MenuContext)

  const handleClick = async (): Promise<void> => {
    await selectDeck(deck)
    toggleDrawerOpen()
  }

  return (
    <li className={isSelected ? 'bordered' : ''}>
      <button className="text-xl" onClick={handleClick}>
        {deck.title}
      </button>
    </li>
  )
}
