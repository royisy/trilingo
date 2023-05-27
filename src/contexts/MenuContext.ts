import { createContext, type Dispatch, type SetStateAction } from 'react'
import { type Deck } from '../models/Deck'

export type MenuComponentKey = 'menu' | 'add-deck' | 'delete-deck'

interface IMenuContext {
  setDrawerOpen: Dispatch<SetStateAction<boolean>>
  setMenuComponent: Dispatch<SetStateAction<MenuComponentKey>>
  setDeckToDelete: Dispatch<SetStateAction<Deck | null>>
}

export const MenuContext = createContext<IMenuContext>({
  setDrawerOpen: () => {},
  setMenuComponent: () => {},
  setDeckToDelete: () => {},
})
