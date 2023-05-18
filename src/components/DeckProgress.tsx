import { type Word } from '../models/Word'
import { getColor, getOpacity } from '../utils/wordUtils'

interface DeckProgressProps {
  words: Word[]
}

export const DeckProgress = ({ words }: DeckProgressProps): JSX.Element => {
  const maxCorrectCnt = words.reduce((acc, word) => {
    return word.correctCnt > acc ? word.correctCnt : acc
  }, 0)
  const maxSkippedCnt = words.reduce((acc, word) => {
    return word.skippedCnt > acc ? word.skippedCnt : acc
  }, 0)
  const minCorrectCnt = words.reduce((acc, word) => {
    return word.correctCnt > 0 && word.correctCnt < acc ? word.correctCnt : acc
  }, maxCorrectCnt)
  const minSkippedCnt = words.reduce((acc, word) => {
    return word.skippedCnt > 0 && word.skippedCnt < acc ? word.skippedCnt : acc
  }, maxSkippedCnt)

  return (
    <ul
      className="grid w-fit list-none grid-cols-[repeat(20,minmax(0,1fr))]
        gap-2 pb-5"
    >
      {words.map((word) => {
        const color = getColor(word.correctCnt, word.skippedCnt)
        const opacity = getOpacity(
          word.correctCnt,
          word.skippedCnt,
          minCorrectCnt,
          minSkippedCnt,
          maxCorrectCnt,
          maxSkippedCnt
        )
        return (
          <li
            key={word.no}
            className={`tooltip h-3 w-3 rounded-sm sm:h-4 sm:w-4 sm:rounded
              bg-${color}-500 bg-opacity-${opacity}`}
            data-tooltip-id="deck-progress-tooltip"
            data-definition={`${word.definition} / ${word.answer}`}
            data-correct-cnt={word.correctCnt}
            data-skipped-cnt={word.skippedCnt}
          ></li>
        )
      })}
    </ul>
  )
}
