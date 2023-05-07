import { type MenuComponentKey } from './Menu'

interface HeaderProps {
  setMenuComponent: (key: MenuComponentKey) => void
  icon: React.ReactNode
  title: string
}

export const Header = ({
  setMenuComponent,
  icon,
  title,
}: HeaderProps): JSX.Element => {
  return (
    <div className="flex items-center">
      <button
        className="btn-ghost btn-square btn w-10 sm:w-12"
        onClick={() => {
          setMenuComponent('select-deck')
        }}
      >
        {icon}
      </button>
      <h1 className="ml-5 text-2xl font-bold sm:text-3xl">{title}</h1>
    </div>
  )
}
