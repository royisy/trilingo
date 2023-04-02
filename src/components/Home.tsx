import { Link } from 'react-router-dom'
import { useDeck } from '../hooks/useDeck'
import { DeckProgress } from './DeckProgress'

export const Home = (): JSX.Element => {
  const { title, words } = useDeck()

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
