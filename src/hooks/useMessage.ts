import { useEffect, useRef, useState } from 'react'

export const useMessage = (
  timeout: number
): {
  message: string
  setMessage: (message: string) => void
} => {
  const [message, setMessage] = useState('')
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (message === '') {
      return
    }
    const id = setTimeout(() => {
      setMessage('')
    }, timeout)
    timeoutIdRef.current = id

    return () => {
      if (timeoutIdRef.current != null) clearTimeout(timeoutIdRef.current)
    }
  }, [message, timeout])

  return { message, setMessage }
}
