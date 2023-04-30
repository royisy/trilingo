import { XMarkIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'
import { useAddDeck } from '../hooks/useAddDeck'
import { useDeckList } from '../hooks/useDeckList'
import { type CsvDeck } from '../models/CsvDeck'

export const AddDeck = (): JSX.Element => {
  const navigate = useNavigate()
  const deckList = useDeckList()

  return (
    <>
      <h1>Add deck</h1>
      <div>
        <button
          className="btn-square btn"
          onClick={() => {
            navigate('/menu')
          }}
        >
          <XMarkIcon />
        </button>
      </div>
      <ul>
        {deckList.map((csvDeck) => (
          <DeckItem key={csvDeck.id} csvDeck={csvDeck} />
        ))}
      </ul>
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
    <li
      onClick={isLoading ? undefined : handleClick}
      style={{
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.5 : 1,
      }}
    >
      {csvDeck.title}
    </li>
  )
}
