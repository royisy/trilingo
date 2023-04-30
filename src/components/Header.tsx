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
    <div className="flex">
      <button
        className="btn-square btn"
        onClick={() => {
          navigate(navigatePath)
        }}
      >
        {icon}
      </button>
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  )
}
