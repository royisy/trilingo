import { useAddDeck } from '../hooks/useAddDeck'
import { useDeckList } from '../hooks/useDeckList'
import { usePreventDialogClose } from '../hooks/usePreventDialogClose'
import { type CsvDeck } from '../models/CsvDeck'
import { Logo } from './Logo'
import { CustomCircleFlag } from './icons/CustomCircleFlag'

interface AddDeckDialogProps {
  dialogRef: React.RefObject<HTMLDialogElement>
}

export const AddDeckDialog = ({
  dialogRef,
}: AddDeckDialogProps): JSX.Element => {
  usePreventDialogClose(dialogRef)

  return (
    <dialog className="modal" ref={dialogRef}>
      <form
        method="dialog"
        className="modal-box flex h-[500px] flex-col items-center text-xl"
      >
        <Logo className="my-5" />
        <p className="my-5">Select a deck to get started.</p>
        <div className="flex w-full flex-col items-center overflow-y-auto">
          <DeckList />
        </div>
      </form>
    </dialog>
  )
}

const DeckList = (): JSX.Element => {
  const { deckListToAdd: deckList, isLoading } = useDeckList()

  if (isLoading) {
    return (
      <>
        <div className="mt-28">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </>
    )
  }

  return (
    <ul className="menu w-fit">
      <>
        {deckList.map((csvDeck) => (
          <DeckItem key={csvDeck.id} csvDeck={csvDeck} />
        ))}
      </>
    </ul>
  )
}

interface DeckItemProps {
  csvDeck: CsvDeck
}

const DeckItem = ({ csvDeck }: DeckItemProps): JSX.Element => {
  const { addDeck, isLoading } = useAddDeck()

  const handleClick = async (): Promise<void> => {
    await addDeck(csvDeck)
  }

  return (
    <li className="py-1" onClick={isLoading ? undefined : handleClick}>
      <button className="text-xl">
        <span className="h-5 w-5">
          <CustomCircleFlag countryCode={csvDeck.language} />
        </span>
        {csvDeck.title}
      </button>
    </li>
  )
}
