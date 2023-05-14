import { Bars3Icon } from '@heroicons/react/24/solid'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { useDeck } from '../hooks/useDeck'
import { getAppSetting } from '../repositories/appSetting'
import { DeckProgress } from './DeckProgress'
import { Menu } from './Menu'

export const Home = (): JSX.Element => {
  const appSetting = useLiveQuery(getAppSetting)
  const deckId = appSetting?.selectedDeckId ?? null
  const { title, words } = useDeck(deckId)
  const navigate = useNavigate()

  return (
    <div className="drawer-mobile drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-5">
        <div className="flex flex-col">
          <div className="flex items-center">
            <label
              htmlFor="my-drawer"
              className="btn-ghost drawer-button btn-square btn w-10 sm:w-12 lg:hidden"
            >
              <Bars3Icon className="w-10 sm:w-12" />
            </label>
            <h1 className="ml-5 text-2xl font-bold sm:text-3xl lg:ml-0 lg:hidden">
              {title}
            </h1>
          </div>
          {title != null && (
            <>
              <div className="my-10 lg:mt-0">
                <button
                  className="btn-primary btn"
                  onClick={() => {
                    navigate('/practice')
                  }}
                >
                  Practice
                </button>
              </div>
              <DeckProgress words={words} />
            </>
          )}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="w-80 bg-base-200">
          <Menu />
        </div>
      </div>
    </div>
  )
}
