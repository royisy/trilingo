import { type Word } from '../models/Word'
import { getColor, getOpacity } from '../utils/wordUtils'

interface DeckProgressProps {
  words: Word[]
}

export const DeckProgress = ({ words }: DeckProgressProps): JSX.Element => {
  const maxSkippedCnt = words.reduce((acc, word) => {
    return word.skippedCnt > acc ? word.skippedCnt : acc
  }, 0)
  const minSkippedCnt = words.reduce((acc, word) => {
    return word.skippedCnt > 0 && word.skippedCnt < acc ? word.skippedCnt : acc
  }, maxSkippedCnt)

  return (
    <div className="flex justify-center">
      <ul
        className="grid w-fit list-none grid-cols-[repeat(20,minmax(0,1fr))]
        gap-1.5 sm:gap-2"
      >
        {words.map((word) => {
          const color = getColor(word.correctCnt, word.skippedCnt)
          const opacity = getOpacity(
            word.correctCnt,
            word.skippedCnt,
            minSkippedCnt,
            maxSkippedCnt
          )
          return (
            <li
              key={word.id}
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
    </div>
  )
}
