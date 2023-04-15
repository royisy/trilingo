import { useEffect, useRef, useState } from 'react'

export const useMessage = (
  timeout: number
): {
  message: string
  setMessage: (message: string) => void
} => {
  const [message, setMessage] = useState('')
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (message === '') {
      return
    }
    const timeoutId = setTimeout(() => {
      setMessage('')
    }, timeout)
    timeoutIdRef.current = timeoutId

    return () => {
      if (timeoutIdRef.current != null) clearTimeout(timeoutIdRef.current)
    }
  }, [message, timeout])

  return { message, setMessage }
}
