import { useLiveQuery } from 'dexie-react-hooks'
import { Link, useNavigate } from 'react-router-dom'
import { type Deck } from '../models/Deck'
import { getAppSetting } from '../repositories/appSetting'
import { getAllDecks } from '../repositories/deck'

export const Menu = (): JSX.Element => {
  const decks = useLiveQuery(getAllDecks)

  return (
    <>
      <h1>Menu</h1>
      <p>
        <Link to="/">Home</Link>
      </p>
      <ul>
        {decks?.map((deck) => (
          <DeckItem key={deck.id} deck={deck} />
        ))}
      </ul>
      <p>
        <Link to="add-deck">Add deck</Link>
      </p>
      <p>
        <Link to="delete-deck">Delete deck</Link>
      </p>
    </>
  )
}

const DeckItem = ({ deck }: { deck: Deck }): JSX.Element => {
  const navigate = useNavigate()

  const selectDeck = async (): Promise<void> => {
    const appSetting = await getAppSetting()
    appSetting.selectedDeckId = deck.id
    await appSetting.save()
    navigate('/')
  }

  return <li onClick={selectDeck}>{deck.title}</li>
}
