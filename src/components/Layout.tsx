interface LayoutProps {
  children: JSX.Element
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-screen-md p-5">{children}</div>
    </div>
  )
}
