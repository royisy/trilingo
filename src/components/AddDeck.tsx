import { XMarkIcon } from '@heroicons/react/24/solid'
import { useContext } from 'react'
import { useAddDeck } from '../hooks/useAddDeck'
import { useDeckList } from '../hooks/useDeckList'
import { type CsvDeck } from '../models/CsvDeck'
import { DeckList } from './DeckList'
import { Header } from './Header'
import { MenuComponentContext } from './Menu'

export const AddDeck = (): JSX.Element => {
  const deckList = useDeckList()

  return (
    <>
      <Header
        icon={<XMarkIcon className="w-10 sm:w-12" />}
        title="Add a new deck"
      />
      <DeckList>
        <>
          {deckList.map((csvDeck) => (
            <DeckItem key={csvDeck.id} csvDeck={csvDeck} />
          ))}
        </>
      </DeckList>
    </>
  )
}

interface DeckItemProps {
  csvDeck: CsvDeck
}

const DeckItem = ({ csvDeck }: DeckItemProps): JSX.Element => {
  const { addDeck, isLoading } = useAddDeck()
  const setMenuComponent = useContext(MenuComponentContext)

  const handleClick = async (): Promise<void> => {
    const success = await addDeck(csvDeck)
    if (success) {
      setMenuComponent('select-deck')
    }
  }

  return (
    <li onClick={isLoading ? undefined : handleClick}>
      <button className="text-xl">{csvDeck.title}</button>
    </li>
  )
}
