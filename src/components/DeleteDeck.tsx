import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { type Deck } from '../models/Deck'
import { AppSettingRepository } from '../repositories/appSetting'
import { DeckRepository } from '../repositories/deck'

export function DeleteDeck(): JSX.Element {
  const repo = new DeckRepository()
  const decks = useLiveQuery(repo.getAll)

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

function DeckItem({ deck }: { deck: Deck }): JSX.Element {
  async function deleteDeck(): Promise<void> {
    const deckRepo = new DeckRepository()
    const dbDeck = await deckRepo.getById(deck.id)
    if (dbDeck == null) {
      return
    }
    dbDeck.delete()
    const appSettingRepo = new AppSettingRepository()
    const appSetting = await appSettingRepo.get()
    appSetting.selectedDeckId = null
    appSetting.save()
  }

  return <li onClick={deleteDeck}>{deck.title}</li>
}
