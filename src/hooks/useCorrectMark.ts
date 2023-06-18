import { useEffect, useRef, useState } from 'react'

export const useCorrectMark = (
  timeout: number
): {
  showCorrect: boolean
  triggerShowCorrect: () => void
} => {
  const [showCorrect, setShowCorrect] = useState(false)
  const [key, setKey] = useState(0)
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowCorrect(false)
    }, timeout)
    timeoutIdRef.current = timeoutId

    return () => {
      if (timeoutIdRef.current != null) clearTimeout(timeoutIdRef.current)
    }
  }, [showCorrect, key, timeout])

  const triggerShowCorrect = (): void => {
    setShowCorrect(true)
    setKey((prevKey) => prevKey + 1)
  }

  return { showCorrect, triggerShowCorrect }
}
