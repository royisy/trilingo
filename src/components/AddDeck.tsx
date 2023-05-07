import { XMarkIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'
import { useAddDeck } from '../hooks/useAddDeck'
import { useDeckList } from '../hooks/useDeckList'
import { type CsvDeck } from '../models/CsvDeck'
import { DeckList } from './DeckList'
import { Header } from './Header'

export const AddDeck = (): JSX.Element => {
  const deckList = useDeckList()

  return (
    <>
      <Header
        navigatePath="/menu"
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
  const navigate = useNavigate()

  const handleClick = async (): Promise<void> => {
    const success = await addDeck(csvDeck)
    if (success) {
      navigate('/menu')
    }
  }

  return (
    <li onClick={isLoading ? undefined : handleClick}>
      <button className="text-xl">{csvDeck.title}</button>
    </li>
  )
}
