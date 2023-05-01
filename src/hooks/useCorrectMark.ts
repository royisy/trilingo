import { useEffect, useRef, useState } from 'react'

export const useMessage = (
  timeout: number
): {
  message: string
  showMessage: (message: string) => void
} => {
  const [message, setMessage] = useState('')
  const [messageKey, setMessageKey] = useState(0)
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
  }, [message, messageKey, timeout])

  const showMessage = (newMessage: string): void => {
    setMessage(newMessage)
    setMessageKey((prevKey) => prevKey + 1)
  }

  return { message, showMessage }
}
