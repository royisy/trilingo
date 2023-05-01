import { useEffect, useRef, useState } from 'react'

export const useCorrectMark = (
  timeout: number
): {
  isCorrect: boolean
  showCorrect: () => void
} => {
  const [isCorrect, setIsCorrect] = useState(false)
  const [key, setKey] = useState(0)
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsCorrect(false)
    }, timeout)
    timeoutIdRef.current = timeoutId

    return () => {
      if (timeoutIdRef.current != null) clearTimeout(timeoutIdRef.current)
    }
  }, [isCorrect, key, timeout])

  const showCorrect = (): void => {
    setIsCorrect(true)
    setKey((prevKey) => prevKey + 1)
  }

  return { isCorrect, showCorrect }
}
