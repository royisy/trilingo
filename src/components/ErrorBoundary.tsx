import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ErrorPage } from './ErrorPage'

interface ErrorBoundaryProps {
  children: JSX.Element
}

/**
 * An ErrorBoundary component that catches unhandled promise rejections
 * and displays an error page.
 *
 * @param props The properties for the ErrorBoundary component.
 * @param props.children The children components to be wrapped by the ErrorBoundary.
 * @returns The rendered ErrorBoundary component.
 */
export const ErrorBoundary = ({
  children,
}: ErrorBoundaryProps): JSX.Element => {
  const [error, setError] = useState<Error | null>(null)
  const location = useLocation()

  const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    setError(event.reason)
  }

  useEffect(() => {
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  useEffect(() => {
    setError(null)
  }, [location])

  if (error !== null) {
    return <ErrorPage />
  }

  return <>{children}</>
}
