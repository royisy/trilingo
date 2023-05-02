import { type Word } from '../models/Word'
import { getColor } from '../utils/wordUtils'

interface DeckProgressProps {
  words: Word[]
}

export const DeckProgress = ({ words }: DeckProgressProps): JSX.Element => {
  return (
    <>
      <ul className="grid w-fit list-none grid-cols-20 gap-2">
        {words.map((word) => {
          const dataTip = `${word.definition} / ${word.answer}`
          const color = getColor(word.correctCnt, word.skippedCnt)
          const className = `tooltip h-5 w-5 rounded-md bg-${color}-500`
          return (
            <li className={className} key={word.no} data-tip={dataTip}></li>
          )
        })}
      </ul>
    </>
  )
}
