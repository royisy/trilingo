import { Link } from 'react-router-dom'

export const NoMatch = (): JSX.Element => {
  return (
    <>
      <h1>Not Found</h1>
      <p>
        <Link to="/">Home</Link>
      </p>
    </>
  )
}
