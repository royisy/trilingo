import { useEffect, useState } from 'react'

interface ErrorBoundaryProps {
  children: JSX.Element
}

/**
 * A component that catches errors thrown by its children and displays a fallback UI.
 *
 * @param children
 * @returns
 */
export const ErrorBoundary = ({
  children,
}: ErrorBoundaryProps): JSX.Element => {
  const [error, setError] = useState<Error | null>(null)

  const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    setError(event.reason)
  }

  useEffect(() => {
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  if (error !== null) {
    return (
      <div
        onClick={() => {
          setError(null)
        }}
      >
        <p>Error: Something went wrong...</p>
        {children}
      </div>
    )
  }

  return <div>{children}</div>
}
