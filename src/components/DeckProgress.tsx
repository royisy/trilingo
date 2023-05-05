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
    <ul className="grid w-fit list-none grid-cols-20 gap-2 sm:gap-2">
      {words.map((word) => {
        const dataTip = `${word.definition} / ${word.answer}`
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
            className={`tooltip h-3 w-3 rounded-sm sm:h-5 sm:w-5 sm:rounded-md
              bg-${color}-500 bg-opacity-${opacity}`}
            key={word.no}
            data-tip={dataTip}
          ></li>
        )
      })}
    </ul>
  )
}
