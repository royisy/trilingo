import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { type Deck } from '../models/Deck'
import { getAppSetting } from '../repositories/appSetting'
import { getAllDecks, getDeckById } from '../repositories/deck'

export const DeleteDeck = (): JSX.Element => {
  const decks = useLiveQuery(getAllDecks)

  return (
    <>
      <h1>Delete deck</h1>
      <p>
        <Link to="/menu">Menu</Link>
      </p>
      <ul>
        {decks?.map((deck) => (
          <DeckItem key={deck.id} deck={deck} />
        ))}
      </ul>
    </>
  )
}

const DeckItem = ({ deck }: { deck: Deck }): JSX.Element => {
  const deleteDeck = async (): Promise<void> => {
    const dbDeck = await getDeckById(deck.id)
    if (dbDeck == null) {
      return
    }
    await dbDeck.delete()
    const appSetting = await getAppSetting()
    appSetting.selectedDeckId = null
    await appSetting.save()
  }

  return <li onClick={deleteDeck}>{deck.title}</li>
}
