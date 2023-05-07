import { useState } from 'react'
import { AddDeck } from './AddDeck'
import { DeleteDeck } from './DeleteDeck'
import { SelectDeck } from './SelectDeck'

export type MenuComponentKey = 'select-deck' | 'add-deck' | 'delete-deck'

export const Menu = (): JSX.Element => {
  const [menuComponent, setMenuComponent] =
    useState<MenuComponentKey>('select-deck')

  return (
    <>
      {menuComponent === 'select-deck' && (
        <SelectDeck setMenuComponent={setMenuComponent} />
      )}
      {menuComponent === 'add-deck' && (
        <AddDeck setMenuComponent={setMenuComponent} />
      )}
      {menuComponent === 'delete-deck' && (
        <DeleteDeck setMenuComponent={setMenuComponent} />
      )}
    </>
  )
}
