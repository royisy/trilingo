import { useEffect, useState } from 'react'

interface ErrorBoundaryProps {
  children: JSX.Element
}

/**
 * An ErrorBoundary component that catches unhandled promise rejections
 * and displays an error message.
 *
 * @param props The properties for the ErrorBoundary component.
 * @param props.children The children components to be wrapped by the ErrorBoundary.
 * @returns The rendered ErrorBoundary component.
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
