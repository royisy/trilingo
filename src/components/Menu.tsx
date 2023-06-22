import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import { useLiveQuery } from 'dexie-react-hooks'
import { useContext } from 'react'
import { MenuContext } from '../contexts/MenuContext'
import { useSelectDeck } from '../hooks/useSelectDeck'
import { type Deck } from '../models/Deck'
import { getAppSetting } from '../repositories/appSetting'
import { getAllDecks } from '../repositories/deck'
import { Logo } from './Logo'
import { CustomCircleFlag } from './icons/CustomCircleFlag'

export const Menu = (): JSX.Element => {
  const decks = useLiveQuery(getAllDecks)
  const appSetting = useLiveQuery(getAppSetting)
  const selectedDeckId = appSetting?.selectedDeckId ?? null
  const { menuComponent, setMenuComponent } = useContext(MenuContext)

  return (
    <>
      <Logo className="p-5" />
      {menuComponent === 'menu' && (
        <ul className="menu">
          {decks?.map((deck) => (
            <DeckItem
              key={deck.id}
              deck={deck}
              isSelected={deck.id === selectedDeckId}
            />
          ))}
        </ul>
      )}
      {menuComponent === 'delete-deck' && (
        <ul className="p-2">
          {decks?.map((deck) => (
            <DeleteDeckItem key={deck.id} deck={deck} />
          ))}
        </ul>
      )}
      <div className="mt-5 flex">
        <button
          className="btn-outline btn-square btn-sm btn ml-4"
          onClick={() => {
            setMenuComponent('add-deck')
          }}
          title="Add Deck"
        >
          <PlusIcon className="w-8" />
        </button>
        <label
          className="swap-rotate swap btn-outline btn-square btn-sm btn ml-4"
          title="Delete Deck"
        >
          <input
            type="checkbox"
            onChange={() => {
              if (menuComponent === 'menu') {
                setMenuComponent('delete-deck')
              } else {
                setMenuComponent('menu')
              }
            }}
            checked={menuComponent === 'delete-deck'}
          />
          <MinusIcon className="swap-off w-8" />
          <XMarkIcon className="swap-on w-8" />
        </label>
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
    <li className="py-1">
      <button
        className={`text-xl ${isSelected ? 'active' : ''}`}
        onClick={handleClick}
      >
        <span className="h-5 w-5">
          <CustomCircleFlag countryCode={deck.language} />
        </span>
        {deck.title}
      </button>
    </li>
  )
}

interface DeleteDeckItemProps {
  deck: Deck
}

const DeleteDeckItem = ({ deck }: DeleteDeckItemProps): JSX.Element => {
  const { setDeckToDelete, openDialog } = useContext(MenuContext)

  const handleDeckSelect = (deck: Deck): void => {
    setDeckToDelete(deck)
    openDialog()
  }

  return (
    <li className="flex items-center justify-between p-3">
      <div className="flex items-center text-xl">
        <span className="ml-1 mr-2 h-5 w-5">
          <CustomCircleFlag countryCode={deck.language} />
        </span>
        {deck.title}
      </div>
      <button
        className="btn-ghost btn-square btn h-7 min-h-0 w-7"
        onClick={() => {
          handleDeckSelect(deck)
        }}
        title="Delete"
      >
        <TrashIcon className="w-5" />
      </button>
    </li>
  )
}
