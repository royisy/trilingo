import { Link } from 'react-router-dom'

export const NoMatch = (): JSX.Element => {
  return (
    <div className="p-5">
      <h1 className="text-3xl">Not Found</h1>
      <p className="link mt-5">
        <Link to="/">Home</Link>
      </p>
    </div>
  )
}
