import { XMarkIcon } from '@heroicons/react/24/solid'
import { useContext, useState } from 'react'
import { MenuContext } from '../contexts/MenuContext'
import { useAddDeck } from '../hooks/useAddDeck'
import { useDeckList } from '../hooks/useDeckList'
import { type CsvDeck } from '../models/CsvDeck'
import { CustomCircleFlag } from './icons/CustomCircleFlag'

export const AddDeck = (): JSX.Element => {
  const { setMenuComponent } = useContext(MenuContext)

  return (
    <>
      <div className="flex items-center p-4">
        <button
          className="btn btn-square btn-ghost"
          onClick={() => {
            setMenuComponent('menu')
          }}
          title="Close"
        >
          <XMarkIcon className="min-h-0 w-10" />
        </button>
        <h1 className="ml-2 text-2xl font-bold">Add Deck</h1>
      </div>
      <DeckList />
    </>
  )
}

const DeckList = (): JSX.Element => {
  const { deckListToAdd: deckList, isLoading } = useDeckList()
  const [isAddingDeck, setIsAddingDeck] = useState(false)

  if (isLoading || isAddingDeck) {
    return (
      <>
        <div className="mt-28 flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </>
    )
  }

  return (
    <ul className="menu">
      <>
        {deckList.map((csvDeck) => (
          <DeckItem
            key={csvDeck.id}
            csvDeck={csvDeck}
            setIsAddingDeck={setIsAddingDeck}
          />
        ))}
      </>
    </ul>
  )
}

interface DeckItemProps {
  csvDeck: CsvDeck
  setIsAddingDeck: (isAddingDeck: boolean) => void
}

const DeckItem = ({ csvDeck, setIsAddingDeck }: DeckItemProps): JSX.Element => {
  const { addDeck, isLoading } = useAddDeck()
  const { setMenuComponent, toggleDrawerOpen } = useContext(MenuContext)

  const handleClick = async (): Promise<void> => {
    setIsAddingDeck(true)
    const success = await addDeck(csvDeck)
    setIsAddingDeck(false)
    if (success) {
      toggleDrawerOpen()
      setMenuComponent('menu')
    }
  }

  return (
    <li className="py-1" onClick={isLoading ? undefined : handleClick}>
      <button className="text-xl">
        <span className="h-5 w-5">
          <CustomCircleFlag countryCode={csvDeck.language} />
        </span>
        {csvDeck.title}
      </button>
    </li>
  )
}
