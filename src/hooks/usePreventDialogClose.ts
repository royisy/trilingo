import { useEffect } from 'react'

export const usePreventDialogClose = (
  dialogRef: React.RefObject<HTMLDialogElement>
): void => {
  useEffect(() => {
    const handler = (event: Event): void => {
      event.preventDefault()
    }
    const dialogElement = dialogRef.current
    dialogElement?.addEventListener('cancel', handler)

    return () => {
      dialogElement?.removeEventListener('cancel', handler)
    }
  }, [dialogRef])
}
