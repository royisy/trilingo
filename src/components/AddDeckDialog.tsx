import { useAddDeck } from '../hooks/useAddDeck'
import { useDeckList } from '../hooks/useDeckList'
import { type CsvDeck } from '../models/CsvDeck'
import { Logo } from './Logo'
import { CustomCircleFlag } from './icons/CustomCircleFlag'

interface AddDeckDialogProps {
  dialogRef: React.RefObject<HTMLDialogElement>
}

export const AddDeckDialog = ({
  dialogRef,
}: AddDeckDialogProps): JSX.Element => {
  const deckList = useDeckList()

  return (
    <dialog className="modal" ref={dialogRef}>
      <form
        method="dialog"
        className="modal-box flex h-[500px] flex-col items-center text-xl"
      >
        <Logo className="my-5" />
        <p className="mt-5">Select a deck to get started.</p>
        <ul className="menu mt-5">
          <>
            {deckList.map((csvDeck) => (
              <DeckItem key={csvDeck.id} csvDeck={csvDeck} />
            ))}
          </>
        </ul>
      </form>
    </dialog>
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
