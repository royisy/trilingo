import { createContext, type Dispatch, type SetStateAction } from 'react'
import { type Deck } from '../models/Deck'

export type MenuComponentKey = 'menu' | 'add-deck' | 'delete-deck'

interface IMenuContext {
  setMenuComponent: Dispatch<SetStateAction<MenuComponentKey>>
  menuComponent: MenuComponentKey
  toggleDrawerOpen: () => void
  setDeckToDelete: Dispatch<SetStateAction<Deck | null>>
  openDeleteDeckDialog: () => void
}

export const MenuContext = createContext<IMenuContext>({
  setMenuComponent: () => {},
  menuComponent: 'menu',
  toggleDrawerOpen: () => {},
  setDeckToDelete: () => {},
  openDeleteDeckDialog: () => {},
})
