import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, type Dispatch, type SetStateAction } from 'react'
import { type MenuComponentKey } from '../contexts/MenuContext'
import { getAllDecks } from '../repositories/deck'
import { useDialog } from './useDialog'

export const useAddDeckDialog = (
  setMenuComponent: Dispatch<SetStateAction<MenuComponentKey>>,
  drawerOpen: boolean,
  toggleDrawerOpen: () => void
): {
  isLoading: boolean
  showAddDeckDialog: boolean
  addDeckDialogRef: React.RefObject<HTMLDialogElement>
} => {
  const decks = useLiveQuery(getAllDecks)
  const { dialogRef: addDeckDialogRef, openDialog: openAddDeckDialog } =
    useDialog()
  const isLoading = decks === undefined
  const showAddDeckDialog = decks !== undefined && decks.length === 0

  useEffect(() => {
    if (showAddDeckDialog) {
      setMenuComponent('menu')
      if (drawerOpen) toggleDrawerOpen()
      openAddDeckDialog()
      addDeckDialogRef.current?.blur()
    }
  }, [
    addDeckDialogRef,
    decks,
    drawerOpen,
    openAddDeckDialog,
    setMenuComponent,
    showAddDeckDialog,
    toggleDrawerOpen,
  ])

  return { isLoading, showAddDeckDialog, addDeckDialogRef }
}
