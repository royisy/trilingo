import { Link } from 'react-router-dom'

export const ErrorPage = (): JSX.Element => {
  return (
    <>
      <h1>Error</h1>
      <p>Something went wrong...</p>
      <p>
        <Link to="/">Home</Link>
      </p>
    </>
  )
}
