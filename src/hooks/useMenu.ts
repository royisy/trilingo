import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { type MenuComponentKey } from '../contexts/MenuContext'

export const useMenu = (): {
  menuComponent: MenuComponentKey
  setMenuComponent: Dispatch<SetStateAction<MenuComponentKey>>
  drawerOpen: boolean
  toggleDrawerOpen: () => void
} => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuComponent, setMenuComponent] = useState<MenuComponentKey>('menu')

  const toggleDrawerOpen = useCallback((): void => {
    if (drawerOpen) {
      setDrawerOpen(false)
    } else {
      setMenuComponent('menu')
      setDrawerOpen(true)
    }
  }, [drawerOpen])

  return {
    menuComponent,
    setMenuComponent,
    drawerOpen,
    toggleDrawerOpen,
  }
}
