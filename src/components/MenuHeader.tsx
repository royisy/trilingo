import { XMarkIcon } from '@heroicons/react/24/solid'
import { useContext } from 'react'
import { MenuContext } from '../contexts/MenuContext'

interface HeaderProps {
  title: string
}

export const MenuHeader = ({ title }: HeaderProps): JSX.Element => {
  const { setMenuComponent } = useContext(MenuContext)

  return (
    <div className="m-4 flex items-center">
      <button
        className="btn-ghost btn-square btn"
        onClick={() => {
          setMenuComponent('menu')
        }}
        title="Close"
      >
        <XMarkIcon className="min-h-0 w-10" />
      </button>
      <h1 className="ml-2 text-2xl font-bold">{title}</h1>
    </div>
  )
}
