import { Bars3Icon } from '@heroicons/react/24/solid'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'
import { MenuContext, type MenuComponentKey } from '../contexts/MenuContext'
import { useSelectedDeck } from '../hooks/useSelectedDeck'
import { getAppSetting } from '../repositories/appSetting'
import { AddDeck } from './AddDeck'
import { DeckProgress } from './DeckProgress'
import { DeleteDeck } from './DeleteDeck'
import { Logo } from './Logo'
import { Menu } from './Menu'

export const Home = (): JSX.Element => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuComponent, setMenuComponent] = useState<MenuComponentKey>('menu')
  const appSetting = useLiveQuery(getAppSetting)
  const noDeckSelected = appSetting != null && appSetting.selectedDeckId == null
  const { title, words } = useSelectedDeck()
  const navigate = useNavigate()

  const toggleDrawerOpen = async (): Promise<void> => {
    if (drawerOpen) {
      setDrawerOpen(false)
    } else {
      setMenuComponent('menu')
      setDrawerOpen(true)
    }
  }

  return (
    <div className="drawer-mobile drawer">
      <input
        id="home-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={() => {}}
      />
      <div className="drawer-content flex justify-center p-5 lg:justify-start">
        <div className="flex w-[360px] flex-col sm:w-[480px] lg:items-center">
          <div
            className={
              noDeckSelected
                ? 'grid grid-cols-3 items-center'
                : 'flex items-center'
            }
          >
            <label
              htmlFor="home-drawer"
              className="btn-ghost btn-square btn lg:hidden"
              onClick={toggleDrawerOpen}
              title="Menu"
            >
              <Bars3Icon className="min-h-0 w-10 sm:w-12" />
            </label>
            {noDeckSelected && (
              <div className="flex justify-center lg:hidden">
                <Logo />
              </div>
            )}
            {!noDeckSelected && (
              <h1 className="ml-5 text-2xl font-bold sm:text-3xl lg:ml-0 lg:hidden">
                {title}
              </h1>
            )}
          </div>
          {title != null && (
            <>
              <div className="my-10 self-center lg:mt-5">
                <button
                  className="btn-primary btn"
                  onClick={() => {
                    navigate('/practice')
                  }}
                >
                  Practice
                </button>
              </div>
              <div className="flex justify-center">
                <DeckProgress words={words} />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="home-drawer"
          className="drawer-overlay"
          onClick={toggleDrawerOpen}
        ></label>
        <div className="w-80 bg-base-200">
          <MenuContext.Provider value={{ setDrawerOpen, setMenuComponent }}>
            {menuComponent === 'menu' && <Menu />}
            {menuComponent === 'add-deck' && <AddDeck />}
            {menuComponent === 'delete-deck' && <DeleteDeck />}
          </MenuContext.Provider>
        </div>
      </div>
      <Tooltip
        id="deck-progress-tooltip"
        className="z-10 flex flex-col items-center"
        render={({ activeAnchor }) => (
          <div className="flex flex-col items-center">
            <p>{activeAnchor?.getAttribute('data-definition')}</p>
            <dl className="mt-2 grid grid-cols-[auto_auto] gap-1 text-right">
              <dt>Correct:</dt>
              <dd>{activeAnchor?.getAttribute('data-correct-cnt')}</dd>
              <dt>Skipped:</dt>
              <dd>{activeAnchor?.getAttribute('data-skipped-cnt')}</dd>
            </dl>
          </div>
        )}
      />
    </div>
  )
}
