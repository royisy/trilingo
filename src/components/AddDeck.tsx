import { XMarkIcon } from '@heroicons/react/24/solid'
import { useContext } from 'react'
import { MenuContext } from '../contexts/MenuContext'
import { useAddDeck } from '../hooks/useAddDeck'
import { useDeckList } from '../hooks/useDeckList'
import { type CsvDeck } from '../models/CsvDeck'
import { CustomCircleFlag } from './icons/CustomCircleFlag'

export const AddDeck = (): JSX.Element => {
  const { setMenuComponent } = useContext(MenuContext)
  const deckList = useDeckList()

  return (
    <>
      <div className="flex items-center p-4">
        <button
          className="btn-ghost btn-square btn"
          onClick={() => {
            setMenuComponent('menu')
          }}
          title="Close"
        >
          <XMarkIcon className="min-h-0 w-10" />
        </button>
        <h1 className="ml-2 text-2xl font-bold">Add Deck</h1>
      </div>
      <ul className="menu">
        <>
          {deckList.map((csvDeck) => (
            <DeckItem key={csvDeck.id} csvDeck={csvDeck} />
          ))}
        </>
      </ul>
    </>
  )
}

interface DeckItemProps {
  csvDeck: CsvDeck
}

const DeckItem = ({ csvDeck }: DeckItemProps): JSX.Element => {
  const { addDeck, isLoading } = useAddDeck()
  const { setMenuComponent, toggleDrawerOpen } = useContext(MenuContext)

  const handleClick = async (): Promise<void> => {
    const success = await addDeck(csvDeck)
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
