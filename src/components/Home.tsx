import { Bars3Icon } from '@heroicons/react/24/solid'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'
import { MenuContext } from '../contexts/MenuContext'
import { useAddDeckDialog } from '../hooks/useAddDeckDialog'
import { useDeleteDeck } from '../hooks/useDeleteDeck'
import { useDialog } from '../hooks/useDialog'
import { useMenu } from '../hooks/useMenu'
import { useSelectedDeck } from '../hooks/useSelectedDeck'
import { useStats } from '../hooks/useStats'
import { type Deck } from '../models/Deck'
import { type Word } from '../models/Word'
import { getAppSetting } from '../repositories/appSetting'
import { AddDeck } from './AddDeck'
import { AddDeckDialog } from './AddDeckDialog'
import { DeckProgress } from './DeckProgress'
import { Logo } from './Logo'
import { Menu } from './Menu'

export const Home = (): JSX.Element => {
  const { menuComponent, setMenuComponent, drawerOpen, toggleDrawerOpen } =
    useMenu()
  const { isLoading, showAddDeckDialog, addDeckDialogRef } = useAddDeckDialog(
    setMenuComponent,
    drawerOpen,
    toggleDrawerOpen
  )
  const { selectedDeck, words } = useSelectedDeck()
  const [deckToDelete, setDeckToDelete] = useState<Deck | null>(null)
  const { dialogRef: deleteDeckDialogRef, openDialog: openDeleteDeckDialog } =
    useDialog()

  if (isLoading) {
    return <></>
  }

  if (showAddDeckDialog) {
    return <AddDeckDialog dialogRef={addDeckDialogRef} />
  }

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="home-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={() => {}}
      />
      <div className="drawer-content flex justify-center py-5 lg:justify-start lg:p-5">
        <div className="flex w-[360px] flex-col sm:w-[480px] lg:items-center">
          <Header
            toggleDrawerOpen={toggleDrawerOpen}
            selectedDeck={selectedDeck}
          />
          {selectedDeck != null && (
            <>
              <Stats words={words} />
              <PracticeButton />
              <DeckProgress words={words} />
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
        <div className="h-full w-80 bg-base-200">
          <div className="bg-base-200 pb-5">
            <MenuContext.Provider
              value={{
                setMenuComponent,
                menuComponent,
                toggleDrawerOpen,
                setDeckToDelete,
                openDeleteDeckDialog,
              }}
            >
              {(menuComponent === 'menu' ||
                menuComponent === 'delete-deck') && <Menu />}
              {menuComponent === 'add-deck' && <AddDeck />}
            </MenuContext.Provider>
          </div>
        </div>
      </div>
      <WordTooltip />
      <DeleteDeckDialog
        dialogRef={deleteDeckDialogRef}
        deckToDelete={deckToDelete}
      />
    </div>
  )
}

interface HeaderProps {
  toggleDrawerOpen: () => void
  selectedDeck: Deck | null
}

const Header = ({
  toggleDrawerOpen,
  selectedDeck,
}: HeaderProps): JSX.Element => {
  const appSetting = useLiveQuery(getAppSetting)
  const noDeckSelected = appSetting != null && appSetting.selectedDeckId == null

  return (
    <div
      className={
        noDeckSelected ? 'grid grid-cols-3 items-center' : 'flex items-center'
      }
    >
      <label
        htmlFor="home-drawer"
        className="btn btn-square btn-ghost lg:hidden"
        onClick={toggleDrawerOpen}
        title="Menu"
      >
        <Bars3Icon className="min-h-0 w-10 sm:w-12" />
      </label>
      {noDeckSelected && <Logo className="flex justify-center lg:hidden" />}
      {!noDeckSelected && (
        <h1 className="ml-4 text-2xl font-bold sm:ml-5 sm:text-3xl lg:ml-0 lg:hidden">
          {selectedDeck?.title}
        </h1>
      )}
    </div>
  )
}

interface StatsProps {
  words: Word[]
}

const Stats = ({ words }: StatsProps): JSX.Element => {
  const { memorizedWords, remainingWords, progress } = useStats(words)

  return (
    <>
      <div className="stats mt-5 w-fit self-center shadow sm:w-full lg:mt-0">
        <StatsItem title="Memorized" value={memorizedWords.toString()} />
        <StatsItem title="Remaining" value={remainingWords.toString()} />
        <StatsItem title="Progress" value={`${progress}%`} />
      </div>
    </>
  )
}

interface StatsItemProps {
  title: string
  value: string
}

const StatsItem = ({ title, value }: StatsItemProps): JSX.Element => {
  return (
    <>
      <div className="stat place-items-center">
        <div className="stat-title text-sm sm:text-base">{title}</div>
        <div className="stat-value text-2xl sm:text-4xl">{value}</div>
      </div>
    </>
  )
}

const PracticeButton = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className="my-10 self-center">
      <button
        className="btn btn-primary"
        onClick={() => {
          navigate('/practice')
        }}
      >
        Practice
      </button>
    </div>
  )
}

const WordTooltip = (): JSX.Element => {
  return (
    <>
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
    </>
  )
}

interface DeleteDeckDialogProps {
  dialogRef: React.RefObject<HTMLDialogElement>
  deckToDelete: Deck | null
}

const DeleteDeckDialog = ({
  dialogRef,
  deckToDelete,
}: DeleteDeckDialogProps): JSX.Element => {
  const deleteDeck = useDeleteDeck()

  const handleDeleteDeck = async (): Promise<void> => {
    if (deckToDelete != null) {
      await deleteDeck(deckToDelete)
    }
  }

  return (
    <dialog className="modal" ref={dialogRef}>
      <form method="dialog" className="modal-box text-xl">
        <p>Delete &quot;{deckToDelete?.title}&quot;?</p>
        <div className="modal-action">
          <button className="btn btn-outline">Cancel</button>
          <button className="btn btn-primary" onClick={handleDeleteDeck}>
            OK
          </button>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  )
}
