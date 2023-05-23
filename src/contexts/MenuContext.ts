import { createContext, type Dispatch, type SetStateAction } from 'react'

export type MenuComponentKey = 'menu' | 'add-deck' | 'delete-deck'

interface IMenuContext {
  setDrawerOpen: Dispatch<SetStateAction<boolean>>
  setMenuComponent: Dispatch<SetStateAction<MenuComponentKey>>
}

export const MenuContext = createContext<IMenuContext>({
  setDrawerOpen: () => {},
  setMenuComponent: () => {},
})
