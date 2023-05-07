import { XMarkIcon } from '@heroicons/react/24/solid'
import { useAddDeck } from '../hooks/useAddDeck'
import { useDeckList } from '../hooks/useDeckList'
import { type CsvDeck } from '../models/CsvDeck'
import { DeckList } from './DeckList'
import { Header } from './Header'
import { type MenuComponentKey } from './Menu'

interface AddDeckProps {
  setMenuComponent: (key: MenuComponentKey) => void
}

export const AddDeck = ({ setMenuComponent }: AddDeckProps): JSX.Element => {
  const deckList = useDeckList()

  return (
    <>
      <Header
        setMenuComponent={setMenuComponent}
        icon={<XMarkIcon className="w-10 sm:w-12" />}
        title="Add a new deck"
      />
      <DeckList>
        <>
          {deckList.map((csvDeck) => (
            <DeckItem
              key={csvDeck.id}
              csvDeck={csvDeck}
              setMenuComponent={setMenuComponent}
            />
          ))}
        </>
      </DeckList>
    </>
  )
}

interface DeckItemProps {
  csvDeck: CsvDeck
  setMenuComponent: (key: MenuComponentKey) => void
}

const DeckItem = ({
  csvDeck,
  setMenuComponent,
}: DeckItemProps): JSX.Element => {
  const { addDeck, isLoading } = useAddDeck()

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
