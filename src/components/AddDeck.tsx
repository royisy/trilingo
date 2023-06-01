import { useContext } from 'react'
import { MenuContext } from '../contexts/MenuContext'
import { useAddDeck } from '../hooks/useAddDeck'
import { useDeckList } from '../hooks/useDeckList'
import { type CsvDeck } from '../models/CsvDeck'
import { DeckList } from './DeckList'
import { MenuHeader } from './MenuHeader'

export const AddDeck = (): JSX.Element => {
  const deckList = useDeckList()

  return (
    <>
      <MenuHeader title="Add Deck" />
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
      <button className="text-xl">{csvDeck.title}</button>
    </li>
  )
}
