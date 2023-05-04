import { MinusIcon, PlusIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { useSelectDeck } from '../hooks/useSelectDeck'
import { useSelectedDeck } from '../hooks/useSelectedDeck'
import { type Deck } from '../models/Deck'
import { getAllDecks } from '../repositories/deck'
import { DeckList } from './DeckList'
import { Header } from './Header'

export const Menu = (): JSX.Element => {
  const decks = useLiveQuery(getAllDecks)
  const { selectedDeck } = useSelectedDeck()
  const navigate = useNavigate()

  return (
    <>
      <Header navigatePath="/" icon={<XMarkIcon />} title="Menu" />
      <DeckList>
        <>
          {decks?.map((deck) => (
            <DeckItem
              key={deck.id}
              deck={deck}
              isSelected={deck.id === selectedDeck?.id}
            />
          ))}
        </>
      </DeckList>
      <div className="mt-6">
        <button
          className="btn-outline btn-square btn-sm btn ml-3"
          onClick={() => {
            navigate('add-deck')
          }}
        >
          <PlusIcon />
        </button>
        <button
          className="btn-outline btn-square btn-sm btn ml-4"
          onClick={() => {
            navigate('delete-deck')
          }}
        >
          <MinusIcon />
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
  const navigate = useNavigate()

  const handleClick = async (): Promise<void> => {
    await selectDeck(deck)
    navigate('/')
  }

  return (
    <li className={isSelected ? 'bordered' : ''}>
      <button className="text-xl" onClick={handleClick}>
        {deck.title}
      </button>
    </li>
  )
}
