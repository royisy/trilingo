import { Bars3Icon } from '@heroicons/react/24/solid'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { useDeck } from '../hooks/useDeck'
import { getAppSetting } from '../repositories/appSetting'
import { DeckProgress } from './DeckProgress'
import { Header } from './Header'

export const Home = (): JSX.Element => {
  const appSetting = useLiveQuery(getAppSetting)
  const deckId = appSetting?.selectedDeckId ?? null
  const { title, words } = useDeck(deckId)
  const navigate = useNavigate()

  return (
    <>
      <Header
        navigatePath="/menu"
        icon={<Bars3Icon />}
        title={title == null ? 'Trilingo' : title}
      />
      {title != null && (
        <>
          <div className="flex flex-col items-center">
            <div className="my-10">
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
          </div>
        </>
      )}
    </>
  )
}
