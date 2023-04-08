import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { useDeck } from '../hooks/useDeck'
import { getAppSetting } from '../repositories/appSetting'
import { DeckProgress } from './DeckProgress'

export const Home = (): JSX.Element => {
  const appSetting = useLiveQuery(getAppSetting)
  const deckId = appSetting?.selectedDeckId ?? null
  const { title, words } = useDeck(deckId)

  return (
    <>
      <h1>{title == null ? 'Trilingo' : title}</h1>
      <p>
        <Link to="menu">Menu</Link>
      </p>
      {title != null && (
        <>
          <p>
            <Link to="practice">Start</Link>
          </p>
          <DeckProgress words={words} />
        </>
      )}
    </>
  )
}
