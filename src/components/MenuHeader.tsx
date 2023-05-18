import { XMarkIcon } from '@heroicons/react/24/solid'
import { useContext } from 'react'
import { MenuComponentContext } from './Menu'

interface HeaderProps {
  title: string
}

export const MenuHeader = ({ title }: HeaderProps): JSX.Element => {
  const setMenuComponent = useContext(MenuComponentContext)

  return (
    <div className="m-4 flex items-center">
      <button
        className="btn-ghost btn-square btn h-10 min-h-0 w-10"
        onClick={() => {
          setMenuComponent('select-deck')
        }}
      >
        <XMarkIcon />
      </button>
      <h1 className="ml-4 text-2xl font-bold">{title}</h1>
    </div>
  )
}
