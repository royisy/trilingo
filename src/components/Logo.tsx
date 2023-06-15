interface LogoProps {
  className?: string
}

export const Logo = ({ className }: LogoProps): JSX.Element => {
  return (
    <div className={className}>
      <h1 className="font-['Pacifico','cursive'] text-4xl font-bold">
        Trilingo
      </h1>
    </div>
  )
}
