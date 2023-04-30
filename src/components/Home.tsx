import { Bars3Icon } from '@heroicons/react/24/solid'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { useDeck } from '../hooks/useDeck'
import { getAppSetting } from '../repositories/appSetting'
import { DeckProgress } from './DeckProgress'

export const Home = (): JSX.Element => {
  const appSetting = useLiveQuery(getAppSetting)
  const deckId = appSetting?.selectedDeckId ?? null
  const { title, words } = useDeck(deckId)
  const navigate = useNavigate()

  return (
    <>
      <h1>{title == null ? 'Trilingo' : title}</h1>
      <div>
        <button
          className="btn-square btn"
          onClick={() => {
            navigate('/menu')
          }}
        >
          <Bars3Icon />
        </button>
      </div>
      {title != null && (
        <>
          <div>
            <button
              className="btn-primary btn"
              onClick={() => {
                navigate('/practice')
              }}
            >
              Start
            </button>
          </div>
          <DeckProgress words={words} />
        </>
      )}
    </>
  )
}
