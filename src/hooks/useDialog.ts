import { useRef, type RefObject } from 'react'

export const useDialog = (): {
  dialogRef: RefObject<HTMLDialogElement>
  openDialog: () => void
} => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openDialog = (): void => {
    if (dialogRef.current != null && !dialogRef.current.open) {
      dialogRef.current.showModal()
    }
  }

  return { dialogRef, openDialog }
}
