import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  navigatePath: string
  icon: React.ReactNode
  title: string
}

export const Header = ({
  navigatePath,
  icon,
  title,
}: HeaderProps): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center">
      <button
        className="btn-ghost btn-square btn w-10 sm:w-12"
        onClick={() => {
          navigate(navigatePath)
        }}
      >
        {icon}
      </button>
      <h1 className="ml-5 text-2xl font-bold sm:text-3xl">{title}</h1>
    </div>
  )
}
