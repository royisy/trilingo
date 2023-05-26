import { Link } from 'react-router-dom'

export const ErrorPage = (): JSX.Element => {
  return (
    <div className="p-5">
      <h1 className="text-3xl">Error</h1>
      <p className="mt-5">Something went wrong...</p>
      <p className="link mt-5">
        <Link to="/">Home</Link>
      </p>
    </div>
  )
}
