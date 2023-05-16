import { createContext, useState } from 'react'
import { AddDeck } from './AddDeck'
import { DeleteDeck } from './DeleteDeck'
import { SelectDeck } from './SelectDeck'

export type MenuComponentKey = 'select-deck' | 'add-deck' | 'delete-deck'

export const MenuComponentContext = createContext<
  React.Dispatch<React.SetStateAction<MenuComponentKey>>
>(() => {})

export const Menu = (): JSX.Element => {
  const [menuComponent, setMenuComponent] =
    useState<MenuComponentKey>('select-deck')

  return (
    <MenuComponentContext.Provider value={setMenuComponent}>
      {menuComponent === 'select-deck' && <SelectDeck />}
      {menuComponent === 'add-deck' && <AddDeck />}
      {menuComponent === 'delete-deck' && <DeleteDeck />}
    </MenuComponentContext.Provider>
  )
}
