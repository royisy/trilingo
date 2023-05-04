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
        className="btn-square btn"
        onClick={() => {
          navigate(navigatePath)
        }}
      >
        {icon}
      </button>
      <h1 className="pl-5 text-3xl font-bold">{title}</h1>
    </div>
  )
}
